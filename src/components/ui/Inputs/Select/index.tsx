import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  Animated,
  Dimensions,
  I18nManager,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';

import i18n from '@config/i18n';

import {
  Box,
  HStack,
  Text,
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
} from '@gluestack-ui/themed';
import { LucideIcon } from '@ui';
import { getSelectTriggerStyles } from './Styles';

let ReactDOM: any = null;
if (Platform.OS === 'web') {
  ReactDOM = require('react-dom');
}

type Option = {
  value: string;
  name?: string;
  nativeName?: string;
  isRTL?: boolean;
  status?: string;
};

type RawOption =
  | string
  | {
    label?: string;
    name?: string;
    value: string | null;
    status?: string;
  }
  | Option;

type DropdownPosition = {
  top?: number;
  bottom?: number;
  left: number;
  width: number;
  maxHeight: number;
};

type SelectProps = {
  options: RawOption[];
  value: string | string[];
  // Kept as `any` (not a strict `string | string[]` union) so every existing
  // single-select call site's narrower callback (e.g. `(value: string) => void`)
  // stays assignable without touching each of those unrelated screens — only
  // this component's own internals need to actually handle both shapes.
  onChange: (value: any, label: any) => void;
  placeholder?: string;
  bg?: string;
  borderColor?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  borderRadius?: string | number;
  disabled?: boolean;
  isReadOnly?: boolean;
  /** Opt-in multi-select mode: `value`/`onChange` become array-valued, a checkbox
   * appears beside every option, and picking one doesn't close the dropdown. */
  multiple?: boolean;
  showSearch?: boolean;
  searchPlaceholder?: string;
};

const DROPDOWN_Z = 100000;
const DROPDOWN_GAP = 4;
const VIEWPORT_MARGIN = 12;
const DEFAULT_DROPDOWN_MAX_HEIGHT = 280;
const MIN_DROPDOWN_HEIGHT = 96;

const SELECT_SIZE_HEIGHT: Record<
  NonNullable<SelectProps['size']>,
  number
> = {
  xs: 32,
  sm: 36,
  md: 40,
  lg: 44,
  xl: 48,
};

function normalizeOptions(
  options: RawOption[],
): Option[] {
  return options.map(
    (
      e: RawOption,
      index: number,
    ) => {
      if (
        typeof e === 'object' &&
        'value' in e &&
        typeof e.value === 'string' &&
        ('name' in e ||
          'nativeName' in e)
      ) {
        return e as Option;
      }

      if (typeof e === 'string') {
        return {
          value: e,
          name: e,
        };
      }

      if (
        typeof e === 'object' &&
        e !== null
      ) {
        let optionValue: string;

        let optionName: string;

        if (
          'value' in e &&
          e.value !== undefined
        ) {
          optionValue =
            e.value === null
              ? '__NULL_VALUE__'
              : String(e.value);
        } else {
          optionValue = '';
        }

        optionName =
          ('label' in e
            ? e.label
            : undefined) ??
          ('name' in e
            ? e.name
            : undefined) ??
          optionValue;

        return {
          value: optionValue,
          name: optionName,
          status: 'status' in e ? (e as any).status : undefined,
        };
      }

      return {
        value: String(index),
        name: 'Unknown',
      };
    },
  );
}

function resolveRefToDom(
  node: unknown,
): HTMLElement | null {
  if (!node) return null;

  const n = node as any;

  if (
    typeof n.getBoundingClientRect ===
    'function'
  ) {
    return n as HTMLElement;
  }

  const inner =
    n._nativeNode ?? n.current ?? n;

  if (
    inner &&
    typeof inner.getBoundingClientRect ===
    'function'
  ) {
    return inner as HTMLElement;
  }

  return null;
}

/* ========================= */
/* WEB SELECT */
/* ========================= */

function WebSelect({
  options,
  value,
  onChange,
  placeholder,
  bg = '$white',
  borderColor = '$borderColor',
  size = 'sm',
  borderRadius = 10,
  disabled = false,
  isReadOnly = false,
  multiple = false,
  showSearch = false,
  searchPlaceholder,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [hoveredValue, setHoveredValue] = useState<string | null>(null);

  const normalizedOptions = useMemo(
    () => normalizeOptions(options),
    [options],
  );

  useEffect(() => {
    if (!open) {
      setSearchText('');
      setHoveredValue(null);
    }
  }, [open]);

  const filteredOptions = useMemo(() => {
    if (!showSearch || !searchText) return normalizedOptions;
    const q = searchText.toLowerCase();
    return normalizedOptions.filter((opt) => {
      const label = opt.nativeName || opt.name || opt.value || '';
      return label.toLowerCase().includes(q);
    });
  }, [showSearch, searchText, normalizedOptions]);

  const valueArray = useMemo(
    () => (multiple && Array.isArray(value) ? value : []),
    [multiple, value],
  );

  const valueKey = multiple ? '' : String((value as string) ?? '');

  const selectedOption =
    normalizedOptions.find(
      opt => opt.value === valueKey,
    );

  const displayValue = multiple
    ? valueArray.length > 0
      ? `${valueArray.length} Selected`
      : ''
    : selectedOption?.nativeName ||
      selectedOption?.name ||
      selectedOption?.value ||
      '';

  const toggleMultiValue = (optionValue: string) => {
    const exists = valueArray.includes(optionValue);
    const next = exists
      ? valueArray.filter(v => v !== optionValue)
      : [...valueArray, optionValue];
    const labels = next.map(v => {
      const opt = normalizedOptions.find(o => o.value === v);
      return opt?.nativeName || opt?.name || '';
    });
    onChange(next, labels);
  };

  const isAllSelected =
    multiple &&
    normalizedOptions.length > 0 &&
    valueArray.length === normalizedOptions.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      onChange([], []);
      return;
    }
    const allValues = normalizedOptions.map(o => o.value);
    const allLabels = normalizedOptions.map(o => o.nativeName || o.name || '');
    onChange(allValues, allLabels);
  };

  const localizedPlaceholder =
    placeholder ??
    i18n.t(
      'common.selectOption',
      'Select an option',
    );

  const localizedSelectAll = i18n.t(
    'common.selectAll',
    'Select All',
  );

  const writingDirection =
    I18nManager.isRTL ? 'rtl' : 'ltr';

  const listId = String(useId()).replace(
    /:/g,
    '',
  );

  const triggerRef = useRef<any>(null);

  const [pos, setPos] =
    useState<DropdownPosition>({
      top: 0,
      left: 0,
      width: 0,
      maxHeight:
        DEFAULT_DROPDOWN_MAX_HEIGHT,
    });

  const updatePosition =
    useCallback(() => {
      const el = resolveRefToDom(
        triggerRef.current,
      );

      if (!el) return;

      const rect =
        el.getBoundingClientRect();

      const viewportHeight =
        window.visualViewport?.height ??
        window.innerHeight;

      const viewportWidth =
        window.visualViewport?.width ??
        window.innerWidth;

      const availableBelow = Math.max(
        0,
        viewportHeight -
        rect.bottom -
        VIEWPORT_MARGIN -
        DROPDOWN_GAP,
      );

      const availableAbove = Math.max(
        0,
        rect.top -
        VIEWPORT_MARGIN -
        DROPDOWN_GAP,
      );

      const shouldOpenUp =
        availableBelow <
        DEFAULT_DROPDOWN_MAX_HEIGHT &&
        availableAbove >
        availableBelow;

      const availableHeight =
        shouldOpenUp
          ? availableAbove
          : availableBelow;

      const width = Math.min(
        rect.width,
        viewportWidth -
        VIEWPORT_MARGIN * 2,
      );

      const left = Math.min(
        Math.max(
          rect.left,
          VIEWPORT_MARGIN,
        ),
        Math.max(
          VIEWPORT_MARGIN,
          viewportWidth -
          width -
          VIEWPORT_MARGIN,
        ),
      );

      setPos({
        top: shouldOpenUp
          ? undefined
          : rect.bottom +
          DROPDOWN_GAP,

        bottom: shouldOpenUp
          ? viewportHeight -
          rect.top +
          DROPDOWN_GAP
          : undefined,

        left,

        width,

        maxHeight: Math.max(
          96,
          Math.min(
            DEFAULT_DROPDOWN_MAX_HEIGHT,
            availableHeight,
          ),
        ),
      });
    }, []);

  useEffect(() => {
    if (!open) return;

    updatePosition();

    const onScrollOrResize = () =>
      updatePosition();

    window.addEventListener(
      'scroll',
      onScrollOrResize,
      true,
    );

    window.addEventListener(
      'resize',
      onScrollOrResize,
    );

    return () => {
      window.removeEventListener(
        'scroll',
        onScrollOrResize,
        true,
      );

      window.removeEventListener(
        'resize',
        onScrollOrResize,
      );
    };
  }, [open, updatePosition]);

  const emitChange = (
    stringValue: string,
  ) => {
    const opt = normalizedOptions.find(
      o => o.value === stringValue,
    );

    const label =
      opt?.nativeName ||
      opt?.name ||
      '';

    onChange(stringValue, label);
  };

  const triggerStyles =
    getSelectTriggerStyles(
      bg,
      borderColor,
      size,
      borderRadius as any,
    ) as any;

  const dropdown = open ? (
    <>
      {/* Full-viewport backdrop: physically intercepts the first outside
          click/tap so it never reaches whatever is visually underneath —
          a document-level listener would fire only after the underlying
          element's own click handler already ran. */}
      <Pressable
        onPress={() => setOpen(false)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: DROPDOWN_Z - 1,
        } as any}
      />
    <Box
      id={`select-list-${listId}`}
      bg="$white"
      borderWidth={1}
      borderColor="$borderColor"
      style={{
        position: 'fixed',
        top: pos.top,
        bottom: pos.bottom,
        left: pos.left,
        width: pos.width,
        zIndex: DROPDOWN_Z,
        maxHeight: pos.maxHeight,
        borderRadius: 10,
        overflow: 'hidden',
        boxShadow:
          '0 4px 16px rgba(0,0,0,0.12)',
      } as any}
    >
      {showSearch && (
        <Box
          p="$2"
          borderBottomWidth={1}
          borderColor="$borderColor"
        >
          <HStack
            alignItems="center"
            borderWidth={1}
            borderColor="$borderColor"
            borderRadius={6}
            px="$3"
            bg="$backgroundLight50"
            h={36}
          >
            <LucideIcon name="Search" size={14} color="$textMutedForeground" />
            <input
              placeholder={searchPlaceholder || i18n.t('requestorDashboard.outcomes.searchParticipant', 'Search participant...')}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '14px',
                fontFamily: 'Inter',
                paddingLeft: '8px',
                color: '#1F2937',
              }}
            />
          </HStack>
        </Box>
      )}

      <ScrollView
        nestedScrollEnabled
        style={{
          maxHeight: showSearch ? pos.maxHeight - 52 : pos.maxHeight,
        }}
      >
        {multiple && (
          <Pressable onPress={toggleSelectAll}>
            <HStack
              alignItems="center"
              justifyContent="space-between"
              py="$2.5"
              px="$3"
              borderBottomWidth={1}
              borderColor="$borderColor"
            >
              <Text
                flex={1}
                fontSize="$sm"
                fontFamily="Inter"
                fontWeight="$medium"
                color="$textForeground"
                style={{ writingDirection }}
              >
                {localizedSelectAll}
              </Text>

              <Checkbox
                value="__select_all__"
                isChecked={isAllSelected}
                onChange={() => {}}
                mr="$2"
                size="sm"
                aria-label={localizedSelectAll}
              >
                <CheckboxIndicator
                  borderColor={isAllSelected ? '$primary500' : '$textMuted'}
                  bg={isAllSelected ? '$primary500' : '$white'}
                >
                  <CheckboxIcon color="$white">
                    <LucideIcon name="Check" size={12} color="$white" strokeWidth={3} />
                  </CheckboxIcon>
                </CheckboxIndicator>
              </Checkbox>
            </HStack>
          </Pressable>
        )}

        {filteredOptions.length === 0 ? (
          <Box py="$4" px="$3" alignItems="center">
            <Text fontSize="$sm" fontFamily="Inter" color="$textMutedForeground">
              {i18n.t('requestorDashboard.outcomes.noParticipantFound', 'No participant found')}
            </Text>
          </Box>
        ) : (
          filteredOptions.map((option, index) => {
            const label =
              option.nativeName ||
              option.name ||
              option.value;

            const isSelected = multiple
              ? valueArray.includes(option.value)
              : option.value === valueKey;

            return (
              <Pressable
                key={
                  option.value ??
                  index.toString()
                }
                style={{ width: '100%' }}
                onPress={() => {
                  if (multiple) {
                    toggleMultiValue(option.value);
                  } else {
                    emitChange(
                      option.value,
                    );

                    setOpen(false);
                  }
                }}
                // @ts-ignore
                onMouseEnter={() => setHoveredValue(option.value)}
                onMouseLeave={() => setHoveredValue(null)}
              >
                <HStack
                  alignItems="center"
                  py="$2.5"
                  px="$3"
                  style={{ width: '100%' }}
                  bg={
                    isSelected
                      ? '$background100'
                      : hoveredValue === option.value
                      ? '$background50'
                      : 'transparent'
                  }
                >
                  {!multiple && (
                    <Box w="$5" h="$5" justifyContent="center" alignItems="center" mr="$2">
                      {isSelected && (
                        <LucideIcon
                          name="Check"
                          size={16}
                          color="$textForeground"
                        />
                      )}
                    </Box>
                  )}

                  <HStack flex={1} justifyContent="space-between" alignItems="center">
                    <Text
                      fontSize="$sm"
                      fontFamily="Inter"
                      color="$textForeground"
                      style={{
                        writingDirection,
                      }}
                    >
                      {label}
                    </Text>

                    {option.status && (
                      <Text
                        fontSize="$xs"
                        fontFamily="Inter"
                        color="$textMutedForeground"
                        mr="$2"
                      >
                        {option.status}
                      </Text>
                    )}
                  </HStack>

                  {multiple && (
                    <Checkbox
                      value={option.value}
                      isChecked={isSelected}
                      onChange={() => {}}
                      mr="$2"
                      size="sm"
                      aria-label={label}
                    >
                      <CheckboxIndicator
                        borderColor={isSelected ? '$primary500' : '$textMuted'}
                        bg={isSelected ? '$primary500' : '$white'}
                      >
                        <CheckboxIcon color="$white">
                          <LucideIcon name="Check" size={12} color="$white" strokeWidth={3} />
                        </CheckboxIcon>
                      </CheckboxIndicator>
                    </Checkbox>
                  )}
                </HStack>
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </Box>
    </>
  ) : null;

  return (
    <>
      <Box
        ref={triggerRef}
        w="$full"
      >
        <Pressable
          disabled={disabled || isReadOnly}
          onPress={() =>
            !(disabled || isReadOnly) &&
            setOpen(prev => !prev)
          }
        >
          <HStack
            {...triggerStyles}
            h={SELECT_SIZE_HEIGHT[size]}
            alignItems="center"
            justifyContent="space-between"
            borderWidth={1}
            opacity={
              (disabled && !isReadOnly) ? 0.5 : 1
            }
          >
            <Text
              flex={1}
              px="$3"
              numberOfLines={1}
              fontSize="$sm"
              fontFamily="Inter"
              color={
                displayValue
                  ? '$textForeground'
                  : '$text500'
              }
              style={{
                writingDirection,
              }}
            >
              {displayValue ||
                localizedPlaceholder}
            </Text>

            <Box mr="$3">
              <LucideIcon
                name={
                  open
                    ? 'ChevronUp'
                    : 'ChevronDown'
                }
                size={16}
                color="$textMutedForeground"
              />
            </Box>
          </HStack>
        </Pressable>
      </Box>

      {ReactDOM &&
        dropdown &&
        ReactDOM.createPortal(
          dropdown,
          document.body,
        )}
    </>
  );
}

/* ========================= */
/* NATIVE SELECT */
/* ========================= */

function NativeSelect({
  options,
  value,
  onChange,
  placeholder,
  bg = '$white',
  borderColor = '$borderColor',
  size = 'sm',
  borderRadius = 10,
  disabled = false,
  isReadOnly = false,
  multiple = false,
  showSearch = false,
  searchPlaceholder,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const normalizedOptions = useMemo(
    () => normalizeOptions(options),
    [options],
  );

  useEffect(() => {
    if (!open) {
      setSearchText('');
    }
  }, [open]);

  const filteredOptions = useMemo(() => {
    if (!showSearch || !searchText) return normalizedOptions;
    const q = searchText.toLowerCase();
    return normalizedOptions.filter((opt) => {
      const label = opt.nativeName || opt.name || opt.value || '';
      return label.toLowerCase().includes(q);
    });
  }, [showSearch, searchText, normalizedOptions]);

  const valueArray = useMemo(
    () => (multiple && Array.isArray(value) ? value : []),
    [multiple, value],
  );

  const valueKey = multiple ? '' : String((value as string) ?? '');

  const selectedOption =
    normalizedOptions.find(
      item => item.value === valueKey,
    );

  const displayValue = multiple
    ? valueArray.length > 0
      ? `${valueArray.length} Selected`
      : ''
    : selectedOption?.nativeName ||
      selectedOption?.name ||
      '';

  const toggleMultiValue = (optionValue: string) => {
    const exists = valueArray.includes(optionValue);
    const next = exists
      ? valueArray.filter(v => v !== optionValue)
      : [...valueArray, optionValue];
    const labels = next.map(v => {
      const opt = normalizedOptions.find(o => o.value === v);
      return opt?.nativeName || opt?.name || '';
    });
    onChange(next, labels);
  };

  const isAllSelected =
    multiple &&
    normalizedOptions.length > 0 &&
    valueArray.length === normalizedOptions.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      onChange([], []);
      return;
    }
    const allValues = normalizedOptions.map(o => o.value);
    const allLabels = normalizedOptions.map(o => o.nativeName || o.name || '');
    onChange(allValues, allLabels);
  };

  const localizedPlaceholder =
    placeholder ??
    i18n.t(
      'common.selectOption',
      'Select an option',
    );

  const localizedSelectAll = i18n.t(
    'common.selectAll',
    'Select All',
  );

  const writingDirection =
    I18nManager.isRTL ? 'rtl' : 'ltr';

  const [dropdownLayout, setDropdownLayout] =
    useState({
      top: 0,
      left: 0,
      width: 0,
      maxHeight:
        DEFAULT_DROPDOWN_MAX_HEIGHT,
      openUp: false,
    });

  const triggerRef = useRef<any>(null);

  const animation = useRef(
    new Animated.Value(0),
  ).current;

  const [keyboardY, setKeyboardY] =
    useState(
      Dimensions.get('window').height,
    );

  useEffect(() => {
    Animated.timing(animation, {
      toValue: open ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [open]);

  useEffect(() => {
    const showSub =
      Keyboard.addListener(
        'keyboardDidShow',
        event => {
          setKeyboardY(
            event.endCoordinates.screenY,
          );
        },
      );

    const hideSub =
      Keyboard.addListener(
        'keyboardDidHide',
        () => {
          setKeyboardY(
            Dimensions.get('window').height,
          );
        },
      );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const updateDropdownLayout = (
    x: number,
    y: number,
    width: number,
    height: number,
  ) => {
    const window =
      Dimensions.get('window');

    const viewportWidth = window.width;
    const viewportHeight = window.height;
    const viewportBottom = Math.min(
      viewportHeight,
      keyboardY,
    );

    const availableBelow = Math.max(
      0,
      viewportBottom -
        y -
        height -
        VIEWPORT_MARGIN -
        DROPDOWN_GAP,
    );

    const availableAbove = Math.max(
      0,
      y -
        VIEWPORT_MARGIN -
        DROPDOWN_GAP,
    );

    const shouldOpenUp =
      availableBelow <
        DEFAULT_DROPDOWN_MAX_HEIGHT &&
      availableAbove > availableBelow;

    const availableHeight =
      shouldOpenUp
        ? availableAbove
        : availableBelow;

    const adjustedWidth = Math.min(
      width,
      Math.max(
        0,
        viewportWidth -
          VIEWPORT_MARGIN * 2,
      ),
    );

    const adjustedLeft = Math.min(
      Math.max(x, VIEWPORT_MARGIN),
      Math.max(
        VIEWPORT_MARGIN,
        viewportWidth -
          adjustedWidth -
          VIEWPORT_MARGIN,
      ),
    );

    const minimumHeight = Math.min(
      MIN_DROPDOWN_HEIGHT,
      availableHeight,
    );

    const menuHeight = Math.max(
      minimumHeight,
      Math.min(
        DEFAULT_DROPDOWN_MAX_HEIGHT,
        availableHeight,
      ),
    );

    const adjustedTop = shouldOpenUp
      ? Math.max(
          VIEWPORT_MARGIN,
          y - DROPDOWN_GAP - menuHeight,
        )
      : Math.min(
          y + height + DROPDOWN_GAP,
          Math.max(
            VIEWPORT_MARGIN,
            viewportBottom -
              VIEWPORT_MARGIN -
              menuHeight,
          ),
        );

    setDropdownLayout({
      top: adjustedTop,
      left: adjustedLeft,
      width: adjustedWidth,
      maxHeight: menuHeight,
      openUp: shouldOpenUp,
    });
  };

  useEffect(() => {
    if (!open) return;

    triggerRef.current?.measureInWindow(
      (
        x: number,
        y: number,
        width: number,
        height: number,
      ) => {
        updateDropdownLayout(
          x,
          y,
          width,
          height,
        );
      },
    );
  }, [open, keyboardY]);

  const openDropdown = () => {
    if (disabled || isReadOnly) return;

    triggerRef.current?.measureInWindow(
      (
        x: number,
        y: number,
        width: number,
        height: number,
      ) => {
        updateDropdownLayout(
          x,
          y,
          width,
          height,
        );

        setOpen(true);
      },
    );
  };

  const closeDropdown = () => {
    setOpen(false);
  };

  const handleSelect = (
    selectedValue: string,
  ) => {
    if (multiple) {
      toggleMultiValue(selectedValue);
      return;
    }

    const option = normalizedOptions.find(
      item => item.value === selectedValue,
    );

    onChange(
      selectedValue,
      option?.nativeName ||
      option?.name ||
      '',
    );

    closeDropdown();
  };

  const triggerStyles =
    getSelectTriggerStyles(
      bg,
      borderColor,
      size,
      borderRadius as any,
    ) as any;

  const animatedStyle = {
    opacity: animation,

    transform: [
      {
        translateY:
          animation.interpolate({
            inputRange: [0, 1],
            outputRange:
              dropdownLayout.openUp
                ? [8, 0]
                : [-8, 0],
          }),
      },
    ],
  };

  return (
    <>
      <Box ref={triggerRef}>
        <Pressable
          disabled={disabled || isReadOnly}
          onPress={openDropdown}
        >
          <HStack
            {...triggerStyles}
            h={SELECT_SIZE_HEIGHT[size]}
            alignItems="center"
            justifyContent="space-between"
            borderWidth={1}
            opacity={
              (disabled && !isReadOnly) ? 0.5 : 1
            }
          >
            <Text
              flex={1}
              px="$3"
              numberOfLines={1}
              fontSize="$sm"
              fontFamily="Inter"
              color={
                displayValue
                  ? '$textForeground'
                  : '$text500'
              }
              style={{
                writingDirection,
              }}
            >
              {displayValue ||
                localizedPlaceholder}
            </Text>

            <Box mr="$3">
              <LucideIcon
                name={
                  open
                    ? 'ChevronUp'
                    : 'ChevronDown'
                }
                size={16}
                color="$textMutedForeground"
              />
            </Box>
          </HStack>
        </Pressable>
      </Box>

      <Modal
        visible={open}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={
          closeDropdown
        }
      >
        <TouchableWithoutFeedback
          onPress={closeDropdown}
        >
          <Box flex={1}>
            <TouchableWithoutFeedback>
              <Animated.View
                style={[
                  {
                    position:
                      'absolute',

                    top:
                      dropdownLayout.top,

                    left:
                      dropdownLayout.left,

                    width:
                      dropdownLayout.width,

                    maxHeight:
                      dropdownLayout.maxHeight,

                    backgroundColor:
                      '#FFFFFF',

                    borderRadius: 12,

                    borderWidth: 1,

                    borderColor:
                      '#E5E7EB',

                    overflow:
                      'hidden',

                    elevation: 12,
                  },

                  animatedStyle,
                ]}
              >
                {showSearch && (
                  <Box
                    p="$2"
                    borderBottomWidth={1}
                    borderColor="$borderColor"
                  >
                    <HStack
                      alignItems="center"
                      borderWidth={1}
                      borderColor="$borderColor"
                      borderRadius={6}
                      px="$3"
                      bg="$backgroundLight50"
                      h={36}
                    >
                      <LucideIcon name="Search" size={14} color="$textMutedForeground" />
                      <TextInput
                        placeholder={searchPlaceholder || i18n.t('requestorDashboard.outcomes.searchParticipant', 'Search participant...')}
                        value={searchText}
                        onChangeText={setSearchText}
                        placeholderTextColor="#9CA3AF"
                        style={{
                          flex: 1,
                          borderWidth: 0,
                          fontSize: 14,
                          fontFamily: 'Inter',
                          paddingLeft: 8,
                          color: '#1F2937',
                        }}
                      />
                    </HStack>
                  </Box>
                )}

                <ScrollView
                  nestedScrollEnabled
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={
                    false
                  }
                  style={{
                    maxHeight: showSearch ? dropdownLayout.maxHeight - 52 : dropdownLayout.maxHeight,
                  }}
                >
                  {multiple && (
                    <Pressable onPress={toggleSelectAll}>
                      <HStack
                        px="$3"
                        py="$3"
                        alignItems="center"
                        justifyContent="space-between"
                        bg="$white"
                        borderBottomWidth={1}
                        borderColor="$borderColor"
                      >
                        <Checkbox
                          value="__select_all__"
                          isChecked={isAllSelected}
                          onChange={() => {}}
                          mr="$2"
                          size="sm"
                          aria-label={localizedSelectAll}
                        >
                          <CheckboxIndicator
                            borderColor={isAllSelected ? '$primary500' : '$textMuted'}
                            bg={isAllSelected ? '$primary500' : '$white'}
                          >
                            <CheckboxIcon color="$white">
                              <LucideIcon name="Check" size={12} color="$white" strokeWidth={3} />
                            </CheckboxIcon>
                          </CheckboxIndicator>
                        </Checkbox>

                        <Text
                          flex={1}
                          fontSize="$sm"
                          fontFamily="Inter"
                          fontWeight="$medium"
                          color="$textForeground"
                          style={{ writingDirection }}
                        >
                          {localizedSelectAll}
                        </Text>
                      </HStack>
                    </Pressable>
                  )}

                  {filteredOptions.length === 0 ? (
                    <Box py="$4" px="$3" alignItems="center">
                      <Text fontSize="$sm" fontFamily="Inter" color="$textMutedForeground">
                        {i18n.t('requestorDashboard.outcomes.noParticipantFound', 'No participant found')}
                      </Text>
                    </Box>
                  ) : (
                    filteredOptions.map((option, index) => {
                      const label =
                        option.nativeName ||
                        option.name ||
                        option.value;

                      const isSelected = multiple
                        ? valueArray.includes(option.value)
                        : option.value === valueKey;

                      return (
                        <Pressable
                          key={`${option.value}-${index}`}
                          style={{ width: '100%' }}
                          onPress={() =>
                            handleSelect(
                              option.value,
                            )
                          }
                        >
                          <HStack
                            px="$3"
                            py="$3"
                            alignItems="center"
                            style={{ width: '100%' }}
                            bg={
                              isSelected
                                ? '$background50'
                                : '$white'
                            }
                          >
                            {!multiple && (
                              <Box w="$5" h="$5" justifyContent="center" alignItems="center" mr="$2">
                                {isSelected && (
                                  <LucideIcon
                                    name="Check"
                                    size={16}
                                    color="$textForeground"
                                  />
                                )}
                              </Box>
                            )}

                            <HStack flex={1} justifyContent="space-between" alignItems="center">
                              <Text
                                fontSize="$sm"
                                fontFamily="Inter"
                                color="$textForeground"
                                style={{
                                  writingDirection,
                                }}
                              >
                                {label}
                              </Text>

                              {option.status && (
                                <Text
                                  fontSize="$xs"
                                  fontFamily="Inter"
                                  color="$textMutedForeground"
                                  mr="$2"
                                >
                                  {option.status}
                                </Text>
                              )}
                            </HStack>

                            {multiple && (
                              <Checkbox
                                value={option.value}
                                isChecked={isSelected}
                                onChange={() => {}}
                                mr="$2"
                                size="sm"
                                aria-label={label}
                              >
                                <CheckboxIndicator
                                  borderColor={isSelected ? '$primary500' : '$textMuted'}
                                  bg={isSelected ? '$primary500' : '$white'}
                                >
                                  <CheckboxIcon color="$white">
                                    <LucideIcon name="Check" size={12} color="$white" strokeWidth={3} />
                                  </CheckboxIcon>
                                </CheckboxIndicator>
                              </Checkbox>
                            )}
                          </HStack>
                        </Pressable>
                      );
                    })
                  )}
                </ScrollView>
              </Animated.View>
            </TouchableWithoutFeedback>
          </Box>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

/* ========================= */
/* MAIN SELECT */
/* ========================= */

export default function Select(
  props: SelectProps,
) {
  if (Platform.OS === 'web') {
    return <WebSelect {...props} />;
  }

  return <NativeSelect {...props} />;
}