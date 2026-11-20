import { AssignUsersStyles } from '../Styles';

// Participant Reassign reuses the Assign Users design tokens so all flows look identical.
export const ParticipantReassignStyles = {
  ...AssignUsersStyles,
  headerCheckboxCell: {
    width: '$8',
    alignItems: 'flex-start',
  },
  rowCheckboxCell: {
    marginRight: '$2',
  },
};
