/**
 * Question Editor API – Express Router
 *
 * Provides CRUD endpoints for observation template management.
 * Replaces the standalone question-editor/server.js.
 *
 * Usage:
 *   ┌─ In production (server.js):
 *   │     app.use('/qeditor', require('./question-editor-api'));
 *   │
 *   └─ In development (standalone, replaces the separate repo):
 *         node question-editor-api.js
 *         → listens on port 3456; webpack proxy /qeditor/* → :3456/api/*
 */

'use strict';

const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const MONGO_URI  = process.env.MONGO_URI  || 'mongodb://13.127.166.58:21317';
const DB_NAME    = process.env.MONGO_DB   || 'qa-samiksha';
const TENANT_ID  = process.env.tenantId   || 'brac';
const ORG_ID     = process.env.orgId      || 'brac_gbl';

// ─── MongoDB singleton ────────────────────────────────────────────────────────

let _db;
async function getDb() {
  if (!_db) {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    _db = client.db(DB_NAME);
  }
  return _db;
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function getQuestionIdsFromEvidences(evidences = []) {
  const ids = [];
  for (const ev of evidences) {
    for (const sec of ev.sections || []) {
      for (const qId of sec.questions || []) {
        try { ids.push(new ObjectId(qId)); } catch (_) {}
      }
    }
  }
  return ids;
}

function getCriteriaIdsFromThemes(themes = []) {
  const ids = [];
  function walk(nodes) {
    for (const node of nodes) {
      if (node.criteria) {
        for (const c of node.criteria) {
          if (c.criteriaId) {
            try { ids.push(new ObjectId(c.criteriaId)); } catch (_) {}
          }
        }
      }
      if (node.children) walk(node.children);
    }
  }
  walk(themes);
  return ids;
}

function genExternalId() {
  return `Q_EDITOR_${Date.now()}_${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

/**
 * Escape a string for use as a literal prefix in a MongoDB $regex filter.
 * ExternalIds are alphanumeric + underscore, but we escape defensively.
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildCriteriaQuestionsPipeline(externalId, fieldsToSet) {
  const updateFields = {};
  for (const key of ['question', 'responseType', 'displayType', 'options', 'placeholder', 'sectionHeader', 'sectionDescription', 'page', 'hint', 'tip', 'validation', 'visibleIf', 'children']) {
    if (fieldsToSet[key] !== undefined) updateFields[key] = fieldsToSet[key];
  }

  return [{
    $set: {
      evidences: {
        $map: {
          input: '$evidences', as: 'evidence',
          in: {
            $mergeObjects: ['$$evidence', {
              sections: {
                $map: {
                  input: '$$evidence.sections', as: 'section',
                  in: {
                    $mergeObjects: ['$$section', {
                      questions: {
                        $map: {
                          input: '$$section.questions', as: 'q',
                          in: {
                            $cond: {
                              // Match both exact externalId (template) and suffixed variants
                              // (child criteriaQuestions use <baseId>-<timestamp> format).
                              // $indexOfCP returns 0 when externalId is a prefix of $$q.externalId.
                              if: { $eq: [{ $indexOfCP: ['$$q.externalId', externalId] }, 0] },
                              then: { $mergeObjects: ['$$q', updateFields] },
                              else: '$$q',
                            },
                          },
                        },
                      },
                    }],
                  },
                },
              },
            }],
          },
        },
      },
    },
  }];
}

async function propagateToCriteriaQuestions(database, externalId, fieldsToSet, scope, templateCriteriaIds) {
  const pipeline = buildCriteriaQuestionsPipeline(externalId, fieldsToSet);
  // Use prefix regex so we match both the template's exact externalId AND child
  // criteriaQuestions docs where questions carry a "<baseId>-<timestamp>" suffix.
  const filter   = { 'evidences.sections.questions.externalId': { $regex: `^${escapeRegex(externalId)}` } };

  if (scope === 'templateAndFirst' && templateCriteriaIds && templateCriteriaIds.length > 0) {
    const childCriteria = await database.collection('criteria')
      .find({ parentCriteriaId: { $in: templateCriteriaIds } }, { projection: { _id: 1 } })
      .toArray();
    const childIds = childCriteria.map(c => c._id);
    const childSet = childIds.length > 0
      ? { _id: { $in: childIds }, ...filter }
      : filter;
    return database.collection('criteriaQuestions').updateMany(childSet, pipeline);
  }

  return database.collection('criteriaQuestions').updateMany(filter, pipeline);
}

async function getTemplateCriteriaIdsForQuestion(database, externalId) {
  const question = await database.collection('questions').findOne({ externalId });
  if (!question) return [];
  const criteria = await database.collection('criteria').find(
    { parentCriteriaId: { $exists: false }, 'evidences.sections.questions': question._id },
    { projection: { _id: 1 } },
  ).toArray();
  return criteria.map(c => c._id);
}

/**
 * Propagate a dependency change (visibleIf + parent children[]) to criteriaQuestions.
 *
 * Unlike propagateToCriteriaQuestions, which sets a single flat value, this function
 * first resolves the *instance* externalId of both the parent and child question within
 * each criteriaQuestions document (child docs use "<baseId>-<timestamp>" suffixed ids),
 * then stores those instance ids — so the form engine can match answers correctly.
 */
async function propagateDependencyToCriteriaQuestions(database, { childExtId, parentExtId, remove, operator, value, scope, templateCriteriaIds }) {
  const filter = {
    $or: [
      { 'evidences.sections.questions.externalId': { $regex: `^${escapeRegex(childExtId)}` } },
      { 'evidences.sections.questions.externalId': { $regex: `^${escapeRegex(parentExtId)}` } },
    ],
  };

  if (scope === 'templateAndFirst' && templateCriteriaIds && templateCriteriaIds.length > 0) {
    const childCriteria = await database.collection('criteria')
      .find({ parentCriteriaId: { $in: templateCriteriaIds } }, { projection: { _id: 1 } })
      .toArray();
    const childIds = childCriteria.map(c => c._id);
    if (childIds.length > 0) filter._id = { $in: childIds };
  }

  // Flatten evidences > sections > questions into a single array (used twice below).
  // Each call to findInstId re-evaluates this expression; MongoDB evaluates it per-document.
  const flatAllQs = {
    $reduce: {
      input: {
        $reduce: {
          input: { $ifNull: ['$evidences', []] },
          initialValue: [],
          in: { $concatArrays: ['$$value', { $ifNull: ['$$this.sections', []] }] },
        },
      },
      initialValue: [],
      in: { $concatArrays: ['$$value', { $ifNull: ['$$this.questions', []] }] },
    },
  };

  // Return the _id of the first embedded question whose externalId starts with baseExtId,
  // as a hex string (e.g. "6984d259a97625e23240fac7") — the same format the form engine uses.
  // Returns null when no matching question is found.
  const findInstObjId = (baseExtId) => ({
    $reduce: {
      input: flatAllQs,
      initialValue: null,
      in: {
        $cond: {
          if: { $and: [
            { $eq: ['$$value', null] },                                                         // keep first match only
            { $eq: [{ $indexOfCP: [{ $ifNull: ['$$this.externalId', ''] }, baseExtId] }, 0] },  // prefix check
          ]},
          then: { $toString: '$$this._id' },   // ← hex string, NOT an ObjectId object
          else: '$$value',
        },
      },
    },
  });

  // Keep a children[] element only when it is neither the child's id string nor a stale
  // string reference (base or instance externalId) from a previous buggy write.
  // Always compare via $toString so ObjectId-typed legacy entries are handled correctly.
  const keepChildCond = (childIdStrVar) => ({
    $and: [
      { $ne: [{ $toString: '$$c' }, childIdStrVar] },                                              // not this child's id
      { $ne: [{ $indexOfCP: [{ $ifNull: [{ $toString: '$$c' }, ''] }, childExtId] }, 0] },         // not a stale externalId string
    ],
  });

  const pipeline = [{
    $set: {
      evidences: {
        $let: {
          vars: {
            parentObjId: findInstObjId(parentExtId),
            childObjId:  findInstObjId(childExtId),
          },
          in: {
            $map: {
              input: '$evidences', as: 'ev',
              in: {
                $mergeObjects: ['$$ev', {
                  sections: {
                    $map: {
                      input: '$$ev.sections', as: 'sec',
                      in: {
                        $mergeObjects: ['$$sec', {
                          questions: {
                            $map: {
                              input: '$$sec.questions', as: 'q',
                              in: {
                                $switch: {
                                  branches: [
                                    // ── Child question: update visibleIf ──────────────────
                                    {
                                      case: { $eq: [{ $indexOfCP: [{ $ifNull: ['$$q.externalId', ''] }, childExtId] }, 0] },
                                      then: {
                                        $mergeObjects: ['$$q', {
                                          visibleIf: remove
                                            ? []
                                            : [{ operator, value, _id: '$$parentObjId' }],
                                        }],
                                      },
                                    },
                                    // ── Parent question: update children[] ───────────────
                                    {
                                      case: { $eq: [{ $indexOfCP: [{ $ifNull: ['$$q.externalId', ''] }, parentExtId] }, 0] },
                                      then: {
                                        $mergeObjects: ['$$q', {
                                          children: remove
                                            ? {
                                                // Remove the child ObjectId and any stale string references.
                                                $filter: {
                                                  input: { $ifNull: ['$$q.children', []] },
                                                  as: 'c',
                                                  cond: keepChildCond('$$childObjId'),
                                                },
                                              }
                                            : {
                                                // Strip stale references, then append the child's ObjectId.
                                                $concatArrays: [
                                                  {
                                                    $filter: {
                                                      input: { $ifNull: ['$$q.children', []] },
                                                      as: 'c',
                                                      cond: keepChildCond('$$childObjId'),
                                                    },
                                                  },
                                                  ['$$childObjId'],
                                                ],
                                              },
                                        }],
                                      },
                                    },
                                  ],
                                  default: '$$q',
                                },
                              },
                            },
                          },
                        }],
                      },
                    },
                  },
                }],
              },
            },
          },
        },
      },
    },
  }];

  return database.collection('criteriaQuestions').updateMany(filter, pipeline);
}

// ─────────────────────────────────────────────────────────────────────────────
// ROUTER
// ─────────────────────────────────────────────────────────────────────────────

const router = express.Router();
router.use(express.json());

// ── GET /api/solutions ────────────────────────────────────────────────────────
router.get('/api/solutions', async (req, res) => {
  try {
    const database = await getDb();
    const { type } = req.query;

    const filter = {
      type: 'observation',
      isDeleted: { $ne: true },
      parentSolutionId: { $exists: false },
    };

    if (type === 'project') {
      filter.referenceFrom = 'project';
    } else if (type === 'standalone') {
      filter.$or = [
        { referenceFrom: { $exists: false } },
        { referenceFrom: null },
        { referenceFrom: { $nin: ['project', 'PROJECT'] } },
      ];
    }

    const solutions = await database.collection('solutions').find(filter, {
      projection: {
        _id: 1, name: 1, externalId: 1, isReusable: 1,
        referenceFrom: 1, entityType: 1, parentSolutionId: 1,
        programId: 1, programName: 1, createdAt: 1,
      },
    }).sort({ createdAt: -1 }).toArray();

    const solutionIds = solutions.map(s => s._id);
    const childCounts = await database.collection('solutions').aggregate([
      { $match: { parentSolutionId: { $in: solutionIds } } },
      { $group: { _id: '$parentSolutionId', count: { $sum: 1 } } },
    ]).toArray();

    const countMap = {};
    for (const row of childCounts) countMap[row._id.toString()] = row.count;

    res.json({
      success: true,
      data: solutions.map(s => ({
        ...s,
        childCount: countMap[s._id.toString()] || 0,
        templateType: ['project', 'PROJECT'].includes(s.referenceFrom) ? 'project' : 'standalone',
      })),
    });
  } catch (err) {
    console.error('[qeditor] GET /api/solutions', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/solutions/:id/impact ─────────────────────────────────────────────
router.get('/api/solutions/:id/impact', async (req, res) => {
  try {
    const database  = await getDb();
    const solutionId = new ObjectId(req.params.id);

    const childSolutions = await database.collection('solutions')
      .find({ parentSolutionId: solutionId }, { projection: { _id: 1, referenceFrom: 1 } })
      .toArray();
    const childSolutionIds = childSolutions.map(s => s._id);
    const allSolutionIds   = [solutionId, ...childSolutionIds];

    const [observationCount, inProgressCount, submittedCount] = await Promise.all([
      database.collection('observations').countDocuments({ solutionId: { $in: allSolutionIds }, status: { $ne: 'inactive' } }),
      database.collection('observationSubmissions').countDocuments({ solutionId: { $in: allSolutionIds }, status: 'started' }),
      database.collection('observationSubmissions').countDocuments({ solutionId: { $in: allSolutionIds }, status: { $in: ['submitted', 'completed'] } }),
    ]);

    res.json({
      success: true,
      data: {
        childSolutions: childSolutions.length,
        projectLinkedChildren: childSolutions.filter(s => ['project', 'PROJECT'].includes(s.referenceFrom)).length,
        standaloneChildren: childSolutions.filter(s => !['project', 'PROJECT'].includes(s.referenceFrom)).length,
        observations: observationCount,
        inProgressSubmissions: inProgressCount,
        completedSubmissions: submittedCount,
      },
    });
  } catch (err) {
    console.error('[qeditor] GET /api/solutions/:id/impact', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/solutions/:id ────────────────────────────────────────────────────
// Returns sections from questionSequenceByEcm (the actual end-user grouping),
// with questions fetched in sequence order from the questions collection.
router.get('/api/solutions/:id', async (req, res) => {
  try {
    const database   = await getDb();
    const solutionId = new ObjectId(req.params.id);

    const solution = await database.collection('solutions').findOne({ _id: solutionId });
    if (!solution) return res.status(404).json({ success: false, message: 'Solution not found' });

    const qSeq        = solution.questionSequenceByEcm || {};   // { OB: { S1: [extIds], S2: [...] } }
    const sectionNames = solution.sections || {};                // { S1: 'Basic Info', S2: 'Income', ... }

    // Collect every externalId referenced across all ECM sections
    const allExtIds = [];
    for (const ecm of Object.keys(qSeq)) {
      for (const code of Object.keys(qSeq[ecm])) {
        allExtIds.push(...(qSeq[ecm][code] || []));
      }
    }

    // Fetch all template questions in one query
    const questions = await database.collection('questions').find({
      externalId: { $in: allExtIds },
      isDeleted: { $ne: true },
    }).toArray();

    const questionByExtId = {};
    const questionByIdStr = {};
    for (const q of questions) {
      questionByExtId[q.externalId] = q;
      questionByIdStr[q._id.toString()] = q;
    }

    // Resolve a visibleIf condition to a user-friendly object.
    // Legacy docs may store the parent's _id (ObjectId hex) instead of externalId in cond._id.
    const resolveViCond = (cond) => {
      const parentQ = questionByExtId[cond._id] || questionByIdStr[cond._id] || null;
      return {
        parentExternalId: parentQ ? parentQ.externalId : cond._id,
        operator: cond.operator || '===',
        value: cond.value,
        parentQuestionText: parentQ ? (parentQ.question || [])[0] : cond._id,
      };
    };

    const mapQuestion = (q) => {
      const vi = q.visibleIf;
      let visibleIfResolved = null;
      if (Array.isArray(vi) && vi.length > 0) {
        visibleIfResolved = vi.map(resolveViCond);
      } else if (vi && !Array.isArray(vi) && vi._id) {
        visibleIfResolved = [resolveViCond(vi)];
      }
      return {
        _id: q._id,
        externalId: q.externalId,
        questionText: (q.question || [])[0] || '',
        questionTextSecondary: (q.question || [])[1] || '',
        responseType: q.responseType,
        displayType: q.displayType || null,
        options: q.options || [],
        placeholder: q.placeholder || null,
        sectionHeader: q.sectionHeader || null,
        sectionDescription: q.sectionDescription || null,
        page: q.page || '',
        visibleIf: q.visibleIf,
        visibleIfResolved,
        children: q.children || [],
        validation: q.validation,
        showRemarks: q.showRemarks,
        hint: q.hint || null,
        tip: q.tip || null,
      };
    };

    // Build sections in the order defined by questionSequenceByEcm
    const sections = [];
    for (const ecm of Object.keys(qSeq)) {
      for (const code of Object.keys(qSeq[ecm])) {
        const extIds = qSeq[ecm][code] || [];
        const orderedQs = extIds
          .map(extId => questionByExtId[extId])
          .filter(Boolean)
          .map(mapQuestion);

        sections.push({
          code,
          ecm,
          name: sectionNames[code] || code,
          questions: orderedQs,
        });
      }
    }

    res.json({
      success: true,
      data: {
        solution: {
          _id: solution._id, name: solution.name, externalId: solution.externalId,
          isReusable: solution.isReusable, referenceFrom: solution.referenceFrom,
          templateType: ['project', 'PROJECT'].includes(solution.referenceFrom) ? 'project' : 'standalone',
        },
        sections,
      },
    });
  } catch (err) {
    console.error('[qeditor] GET /api/solutions/:id', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PUT /api/questions/:id ────────────────────────────────────────────────────
router.put('/api/questions/:id', async (req, res) => {
  try {
    const database    = await getDb();
    const questionId  = new ObjectId(req.params.id);
    const {
      questionText, questionTextSecondary, responseType, displayType, options,
      placeholder, sectionHeader, sectionDescription, page, hint, tip, validation,
      propagation = 'templateAndFirst',
    } = req.body;

    const question = await database.collection('questions').findOne({ _id: questionId });
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });

    const newQuestionArray  = [...(question.question || ['', ''])];
    const questionsSet      = {};
    const fieldsToPropagate = {};

    if (questionText !== undefined)          { newQuestionArray[0] = questionText; questionsSet['question.0'] = questionText; }
    if (questionTextSecondary !== undefined) { newQuestionArray[1] = questionTextSecondary; questionsSet['question.1'] = questionTextSecondary; }
    if (responseType !== undefined)          { questionsSet.responseType = responseType; fieldsToPropagate.responseType = responseType; }
    if (displayType !== undefined)           { questionsSet.displayType = displayType; fieldsToPropagate.displayType = displayType; }
    if (options !== undefined)               { questionsSet.options = options; fieldsToPropagate.options = options; }
    if (sectionHeader !== undefined)         { questionsSet.sectionHeader = sectionHeader; fieldsToPropagate.sectionHeader = sectionHeader; }
    if (sectionDescription !== undefined)   { questionsSet.sectionDescription = sectionDescription; fieldsToPropagate.sectionDescription = sectionDescription; }
    if (placeholder !== undefined)           { questionsSet.placeholder = placeholder; fieldsToPropagate.placeholder = placeholder; }
    if (page !== undefined)                  { questionsSet.page = page; fieldsToPropagate.page = page; }
    if (hint !== undefined)                  { questionsSet.hint = hint; fieldsToPropagate.hint = hint; }
    if (tip !== undefined)                   { questionsSet.tip = tip; fieldsToPropagate.tip = tip; }
    if (validation !== undefined)            { questionsSet.validation = validation; fieldsToPropagate.validation = validation; }

    fieldsToPropagate.question = newQuestionArray;

    const externalId = question.externalId;
    const qResult    = await database.collection('questions').updateMany({ externalId }, { $set: questionsSet });
    const tmplIds    = await getTemplateCriteriaIdsForQuestion(database, externalId);
    const cqResult   = await propagateToCriteriaQuestions(database, externalId, fieldsToPropagate, propagation, tmplIds);

    res.json({ success: true, message: 'Question updated', questionsUpdated: qResult.modifiedCount, criteriaQuestionsUpdated: cqResult.modifiedCount });
  } catch (err) {
    console.error('[qeditor] PUT /api/questions/:id', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PUT /api/questions/:id/dependency ─────────────────────────────────────────
router.put('/api/questions/:id/dependency', async (req, res) => {
  try {
    const database       = await getDb();
    const childQuestionId = new ObjectId(req.params.id);
    const { parentExternalId, operator = '===', value, remove = false, propagation = 'templateAndFirst' } = req.body;

    const childQ  = await database.collection('questions').findOne({ _id: childQuestionId });
    if (!childQ) return res.status(404).json({ success: false, message: 'Child question not found' });

    // Some legacy documents store visibleIf._id as a MongoDB ObjectId string rather
    // than the externalId string.  Try externalId first, then fall back to _id lookup.
    let parentQ = await database.collection('questions').findOne({ externalId: parentExternalId });
    if (!parentQ) {
      try {
        parentQ = await database.collection('questions').findOne({ _id: new ObjectId(parentExternalId) });
      } catch (_) { /* parentExternalId is not a valid ObjectId — leave parentQ null */ }
    }
    if (!parentQ) return res.status(404).json({ success: false, message: `Parent question not found: ${parentExternalId}` });

    const childExternalId  = childQ.externalId;
    const parentExtId      = parentQ.externalId;
    const parentIdStr = parentQ._id.toString();
    const childIdStr  = childQ._id.toString();

    if (remove) {
      await database.collection('questions').updateMany({ externalId: childExternalId }, { $set: { visibleIf: [] } });
      await database.collection('questions').updateMany(
        { externalId: parentExtId },
        { $pull: { children: { $in: [childQ._id, childIdStr, childExternalId] } } },
      );
    } else {
      // Store the parent's _id as an ObjectId in visibleIf._id (matches how the app stores it).
      const newVisibleIf = [{ operator, value, _id: parentQ._id }];
      await database.collection('questions').updateMany({ externalId: childExternalId }, { $set: { visibleIf: newVisibleIf } });
      // Push the child's ObjectId; skip if already present in any form (ObjectId, string, or externalId).
      await database.collection('questions').updateMany(
        { externalId: parentExtId, children: { $nin: [childQ._id, childIdStr, childExternalId] } },
        { $push: { children: childQ._id } },
      );
    }

    // Propagate visibleIf and children[] to criteriaQuestions in a single pass.
    // The new function resolves each document's own instance externalIds so
    // visibleIf._id and children[] store instance ids, not the base template ids.
    const tmplIds = await getTemplateCriteriaIdsForQuestion(database, childExternalId);
    await propagateDependencyToCriteriaQuestions(database, {
      childExtId:          childExternalId,
      parentExtId,
      remove,
      operator,
      value,
      scope:               propagation,
      templateCriteriaIds: tmplIds,
    });

    res.json({ success: true, message: remove ? 'Dependency removed' : 'Dependency set' });
  } catch (err) {
    console.error('[qeditor] PUT /api/questions/:id/dependency', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/solutions/:id/sections/:ecm/:code/questions ─────────────────────
// Section-aware add: creates the question and inserts it into
// solution.questionSequenceByEcm[ecm][code] at the correct position.
// Also adds to the matching template criteria + criteriaQuestions so the
// propagation system can push it to in-progress observations.
//
// propagation = 'templateAndFirst' (default) — template only
// propagation = 'allInProgress'              — template + all child solutions
router.post('/api/solutions/:id/sections/:ecm/:code/questions', async (req, res) => {
  try {
    const database   = await getDb();
    const solutionId = new ObjectId(req.params.id);
    const { ecm, code } = req.params;
    const {
      questionText, questionTextSecondary = '', responseType = 'radio',
      options = [], displayType, placeholder, sectionHeader, sectionDescription, page,
      hint, tip, validation, afterQuestionId, propagation = 'templateAndFirst',
    } = req.body;

    if (!questionText) return res.status(400).json({ success: false, message: 'questionText is required' });

    const solution = await database.collection('solutions').findOne({ _id: solutionId });
    if (!solution) return res.status(404).json({ success: false, message: 'Solution not found' });

    // ── Create the question document ───────────────────────────────────────
    const externalId  = genExternalId();
    const newQuestion = {
      externalId,
      question: [questionText, questionTextSecondary],
      responseType,
      displayType: displayType || null,
      options,
      placeholder: placeholder || null,
      sectionHeader: sectionHeader || null,
      sectionDescription: sectionDescription || null,
      page: page || '',
      hint: hint || null, tip: tip || null,
      children: [], visibleIf: [], validation: validation || {},
      showRemarks: false, isDeleted: false,
      questionGroup: ['A1'],
      tenantId: TENANT_ID,
      orgId: ORG_ID,
      createdAt: new Date(), updatedAt: new Date(),
    };
    const insertResult  = await database.collection('questions').insertOne(newQuestion);
    const newQuestionId = insertResult.insertedId;

    // ── Insert into questionSequenceByEcm ──────────────────────────────────
    const currentSeq = (solution.questionSequenceByEcm?.[ecm]?.[code]) || [];
    let newSeq;
    if (afterQuestionId) {
      // afterQuestionId is a question _id hex string — look up its externalId
      let afterExtId = null;
      try {
        const afterQ = await database.collection('questions').findOne({ _id: new ObjectId(afterQuestionId) });
        afterExtId = afterQ?.externalId || null;
      } catch (_) {}
      const idx = afterExtId ? currentSeq.indexOf(afterExtId) : -1;
      newSeq = idx >= 0
        ? [...currentSeq.slice(0, idx + 1), externalId, ...currentSeq.slice(idx + 1)]
        : [...currentSeq, externalId];
    } else {
      newSeq = [...currentSeq, externalId];
    }
    await database.collection('solutions').updateOne(
      { _id: solutionId },
      { $set: { [`questionSequenceByEcm.${ecm}.${code}`]: newSeq } },
    );

    // ── Also add to the template criteria that owns this ECM/section ───────
    // Find criteria belonging to this solution that have the target section.
    const tmplCriteriaIds = getCriteriaIdsFromThemes(solution.themes || []);
    const tmplCriteria = tmplCriteriaIds.length
      ? await database.collection('criteria').find({ _id: { $in: tmplCriteriaIds } }).toArray()
      : [];

    // Pick the last criteria that has the target ecm+section
    const targetCriteria = tmplCriteria
      .filter(c => c.evidences?.some(ev => ev.code === ecm && ev.sections?.some(sec => sec.code === code)))
      .slice(-1)[0];

    // Helper: push question _id into criteria.evidences[ecm].sections[code].questions
    function buildUpdatedEvidences(existingEvidences, targetEcm, targetCode, qId, afterQId) {
      return existingEvidences.map(ev => {
        if (ev.code !== targetEcm) return ev;
        return {
          ...ev,
          sections: ev.sections.map(sec => {
            if (sec.code !== targetCode) return sec;
            const ids = [...(sec.questions || [])];
            if (afterQId) {
              const idx = ids.findIndex(id => id.toString() === afterQId);
              idx >= 0 ? ids.splice(idx + 1, 0, qId) : ids.push(qId);
            } else {
              ids.push(qId);
            }
            return { ...sec, questions: ids };
          }),
        };
      });
    }

    if (targetCriteria) {
      // ── Update template criteria doc (question ID list) ─────────────────
      await database.collection('criteria').updateOne(
        { _id: targetCriteria._id },
        { $set: { evidences: buildUpdatedEvidences(targetCriteria.evidences, ecm, code, newQuestionId, afterQuestionId) } },
      );

      // ── Add embedded question to template criteriaQuestions ──────────────
      await database.collection('criteriaQuestions').updateOne(
        { _id: targetCriteria._id, 'evidences.sections': { $exists: true } },
        { $push: { [`evidences.$[ev].sections.$[sec].questions`]: { ...newQuestion, _id: newQuestionId } } },
        { arrayFilters: [{ 'ev.code': ecm }, { 'sec.code': code }] },
      );

      // ── Propagate to all child solutions when requested ──────────────────
      if (propagation === 'allInProgress') {
        // Find all child solutions that were created from this template
        const childSolutions = await database.collection('solutions').find(
          { parentSolutionId: solutionId },
          { projection: { _id: 1, questionSequenceByEcm: 1 } },
        ).toArray();

        if (childSolutions.length > 0) {
          // Find child criteria whose parentCriteriaId = template criteria _id
          // (one child criteria per child solution, keyed by parentCriteriaId)
          const childCriteria = await database.collection('criteria').find(
            { parentCriteriaId: targetCriteria._id },
            { projection: { _id: 1, evidences: 1 } },
          ).toArray();

          for (const cc of childCriteria) {
            // Update child criteria doc (question ID list)
            if (cc.evidences?.length) {
              await database.collection('criteria').updateOne(
                { _id: cc._id },
                { $set: { evidences: buildUpdatedEvidences(cc.evidences, ecm, code, newQuestionId, null) } },
              );
            }

            // Add embedded question to child criteriaQuestions
            // (same question object — no duplication needed for editor-added questions)
            await database.collection('criteriaQuestions').updateOne(
              { _id: cc._id, 'evidences.sections': { $exists: true } },
              { $push: { [`evidences.$[ev].sections.$[sec].questions`]: { ...newQuestion, _id: newQuestionId } } },
              { arrayFilters: [{ 'ev.code': ecm }, { 'sec.code': code }] },
            );
          }

          // Add base externalId to each child solution's questionSequenceByEcm.
          // The assessments helper appends unknowns at the end anyway, but adding
          // here ensures correct position (end of section) and avoids duplicates.
          for (const cs of childSolutions) {
            const childSeq = (cs.questionSequenceByEcm?.[ecm]?.[code]) || [];
            if (!childSeq.includes(externalId)) {
              await database.collection('solutions').updateOne(
                { _id: cs._id },
                { $set: { [`questionSequenceByEcm.${ecm}.${code}`]: [...childSeq, externalId] } },
              );
            }
          }
        }
      }
    }

    res.json({
      success: true,
      message: 'Question added',
      data: { _id: newQuestionId, externalId, ...newQuestion },
    });
  } catch (err) {
    console.error('[qeditor] POST /api/solutions/:id/sections/:ecm/:code/questions', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PUT /api/solutions/:id/sections/:ecm/:code/reorder ────────────────────────
// Reorders questions in one section by updating questionSequenceByEcm.
// The assessments helper already sorts section.questions using this field,
// so criteriaQuestions ordering does not need to be updated separately.
router.put('/api/solutions/:id/sections/:ecm/:code/reorder', async (req, res) => {
  try {
    const database   = await getDb();
    const solutionId = new ObjectId(req.params.id);
    const { ecm, code } = req.params;
    const { orderedExternalIds } = req.body;

    if (!Array.isArray(orderedExternalIds) || !orderedExternalIds.length) {
      return res.status(400).json({ success: false, message: 'orderedExternalIds array is required' });
    }

    const solution = await database.collection('solutions').findOne({ _id: solutionId });
    if (!solution) return res.status(404).json({ success: false, message: 'Solution not found' });

    await database.collection('solutions').updateOne(
      { _id: solutionId },
      { $set: { [`questionSequenceByEcm.${ecm}.${code}`]: orderedExternalIds } },
    );

    res.json({ success: true, message: 'Questions reordered' });
  } catch (err) {
    console.error('[qeditor] PUT /api/solutions/:id/sections/:ecm/:code/reorder', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/criteria/:criteriaId/questions ──────────────────────────────────
router.post('/api/criteria/:criteriaId/questions', async (req, res) => {
  try {
    const database   = await getDb();
    const criteriaId = new ObjectId(req.params.criteriaId);
    const {
      questionText, questionTextSecondary = '', responseType = 'radio',
      options = [], displayType, placeholder, sectionHeader, sectionDescription,
      page, hint, tip, validation, afterQuestionId,
    } = req.body;

    if (!questionText) return res.status(400).json({ success: false, message: 'questionText is required' });

    const criteria = await database.collection('criteria').findOne({ _id: criteriaId });
    if (!criteria) return res.status(404).json({ success: false, message: 'Criteria not found' });

    const externalId  = genExternalId();
    const newQuestion = {
      externalId,
      question: [questionText, questionTextSecondary],
      responseType,
      displayType: displayType || null,
      options,
      placeholder: placeholder || null,
      sectionHeader: sectionHeader || null,
      sectionDescription: sectionDescription || null,
      page: page || '',
      hint: hint || null, tip: tip || null,
      children: [], visibleIf: [], validation: validation || {},
      showRemarks: false, isDeleted: false,
      questionGroup: ['A1'],
      tenantId: TENANT_ID,
      orgId: ORG_ID,
      createdAt: new Date(), updatedAt: new Date(),
    };

    const insertResult  = await database.collection('questions').insertOne(newQuestion);
    const newQuestionId = insertResult.insertedId;

    const evidences = criteria.evidences || [];
    if (!evidences.length || !evidences[0].sections?.length) {
      return res.status(400).json({ success: false, message: 'Criteria has no evidence sections' });
    }

    const currentIds = [...(evidences[0].sections[0].questions || [])];
    if (afterQuestionId) {
      const idx = currentIds.findIndex(id => id.toString() === afterQuestionId);
      idx >= 0 ? currentIds.splice(idx + 1, 0, newQuestionId) : currentIds.push(newQuestionId);
    } else {
      currentIds.push(newQuestionId);
    }
    evidences[0].sections[0].questions = currentIds;

    await database.collection('criteria').updateOne({ _id: criteriaId }, { $set: { evidences } });
    await database.collection('criteriaQuestions').updateOne(
      { _id: criteriaId, 'evidences.sections': { $exists: true } },
      { $push: { 'evidences.0.sections.0.questions': { ...newQuestion, _id: newQuestionId } } },
    );

    res.json({ success: true, message: 'Question added', data: { _id: newQuestionId, externalId, ...newQuestion } });
  } catch (err) {
    console.error('[qeditor] POST /api/criteria/:criteriaId/questions', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── DELETE /api/questions/:id ─────────────────────────────────────────────────
router.delete('/api/questions/:id', async (req, res) => {
  try {
    const database   = await getDb();
    const questionId = new ObjectId(req.params.id);

    const question = await database.collection('questions').findOne({ _id: questionId });
    if (!question) return res.status(404).json({ success: false, message: 'Question not found' });

    const externalId = question.externalId;

    const dependentQuestions = await database.collection('questions').find({
      $or: [{ children: externalId }, { children: questionId }, { 'visibleIf._id': externalId }],
    }).toArray();

    if (dependentQuestions.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Cannot delete: other questions depend on this one. Remove dependencies first.',
        dependentQuestions: dependentQuestions.map(q => ({ _id: q._id, externalId: q.externalId, questionText: (q.question || [])[0] })),
      });
    }

    if (req.query.force !== 'true') {
      const answersExist = await database.collection('observationSubmissions').findOne({ [`answers.${externalId}`]: { $exists: true } });
      if (answersExist) {
        return res.status(409).json({ success: false, message: 'Cannot delete: this question has answers in existing submissions.', hasAnswers: true });
      }
    }

    // Remove from ALL solutions' questionSequenceByEcm (template + child instances).
    // Add propagation stores the same base externalId in every child solution's
    // questionSequenceByEcm, so delete must mirror that and remove it everywhere.
    await database.collection('solutions').updateMany(
      {},
      [{
        $set: {
          questionSequenceByEcm: {
            $arrayToObject: {
              $map: {
                input: { $objectToArray: { $ifNull: ['$questionSequenceByEcm', {}] } },
                as: 'ecmEntry',
                in: {
                  k: '$$ecmEntry.k',
                  v: {
                    $arrayToObject: {
                      $map: {
                        input: { $objectToArray: '$$ecmEntry.v' },
                        as: 'secEntry',
                        in: {
                          k: '$$secEntry.k',
                          v: { $filter: { input: '$$secEntry.v', as: 'extId', cond: { $ne: ['$$extId', externalId] } } },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }],
    );

    await database.collection('criteria').updateMany({}, { $pull: { 'evidences.$[].sections.$[].questions': questionId } });
    await database.collection('criteriaQuestions').updateMany({}, [{
      $set: {
        evidences: {
          $map: {
            input: '$evidences', as: 'ev',
            in: {
              $mergeObjects: ['$$ev', {
                sections: {
                  $map: {
                    input: '$$ev.sections', as: 'sec',
                    in: {
                      $mergeObjects: ['$$sec', {
                        // Keep all questions whose externalId does NOT start with the deleted externalId.
                        questions: { $filter: { input: '$$sec.questions', as: 'q', cond: { $ne: [{ $indexOfCP: ['$$q.externalId', externalId] }, 0] } } },
                      }],
                    },
                  },
                },
              }],
            },
          },
        },
      },
    }]);

    await database.collection('questions').updateMany({ externalId }, { $set: { isDeleted: true, deletedAt: new Date() } });
    res.json({ success: true, message: 'Question deleted' });
  } catch (err) {
    console.error('[qeditor] DELETE /api/questions/:id', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PUT /api/criteria/:criteriaId/reorder ─────────────────────────────────────
router.put('/api/criteria/:criteriaId/reorder', async (req, res) => {
  try {
    const database   = await getDb();
    const criteriaId = new ObjectId(req.params.criteriaId);
    const { orderedQuestionIds } = req.body;

    if (!Array.isArray(orderedQuestionIds) || !orderedQuestionIds.length) {
      return res.status(400).json({ success: false, message: 'orderedQuestionIds array is required' });
    }

    const newOrder = orderedQuestionIds.map(id => new ObjectId(id));
    const criteria = await database.collection('criteria').findOne({ _id: criteriaId });
    if (!criteria) return res.status(404).json({ success: false, message: 'Criteria not found' });

    const evidences = criteria.evidences || [];
    if (!evidences.length || !evidences[0].sections?.length) {
      return res.status(400).json({ success: false, message: 'Criteria has no evidence sections' });
    }

    evidences[0].sections[0].questions = newOrder;
    await database.collection('criteria').updateOne({ _id: criteriaId }, { $set: { evidences } });

    const cq = await database.collection('criteriaQuestions').findOne({ _id: criteriaId });
    if (cq?.evidences?.[0]?.sections?.[0]) {
      const embeddedMap = {};
      for (const eq of cq.evidences[0].sections[0].questions || []) {
        embeddedMap[eq._id?.toString() || ''] = eq;
      }
      const reorderedEmbedded = newOrder.map(id => embeddedMap[id.toString()]).filter(Boolean);
      const newCqEvidences    = [...cq.evidences];
      newCqEvidences[0] = {
        ...newCqEvidences[0],
        sections: [{ ...newCqEvidences[0].sections[0], questions: reorderedEmbedded }, ...newCqEvidences[0].sections.slice(1)],
      };
      await database.collection('criteriaQuestions').updateOne({ _id: criteriaId }, { $set: { evidences: newCqEvidences } });
    }

    res.json({ success: true, message: 'Questions reordered' });
  } catch (err) {
    console.error('[qeditor] PUT /api/criteria/:criteriaId/reorder', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT router (used by server.js) or run standalone (dev)
// ─────────────────────────────────────────────────────────────────────────────

module.exports = router;

if (require.main === module) {
  const app = express();
  // CORS for standalone dev mode (webpack proxy talks to this)
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  });
  app.use('/', router);
  const PORT = process.env.PORT || 3456;
  app.listen(PORT, () => console.log(`[qeditor] Standalone API running on http://localhost:${PORT}`));
}
