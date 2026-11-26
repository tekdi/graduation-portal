import { AssignUsersStyles as CardStyles } from '@components/UserAvatarCard/Styles';
import { filterStyles } from '@components/Filter/Styles';

export const DestinationPolicyStyles = {
  heading: CardStyles.headingStyles,
  description: CardStyles.descriptionTextStyles,
  input: filterStyles.input,
  card: {
    backgroundColor: '$white',
    borderRadius: '$2xl',
    borderWidth: 1,
    borderColor: '$borderLight200',
    borderTopWidth: 4,
    borderTopColor: '$primary500',
    px: '$4',
    py: '$5',
    '$md-px': '$6',
    '$md-py': '$6',
    mt: '$4',
    '$md-mt': '$6',
  },
  fieldsRow: {
    mt: '$6',
    gap: '$4',
    flexDirection: 'column',
    '$md-flexDirection': 'row',
  },
  field: {
    flex: 1,
    gap: '$2',
  },
  label: {
    fontSize: '$sm',
    fontWeight: '$medium',
    color: '$textForeground',
  },
  required: {
    color: '$error500',
  },
  proceedButton: {
    mt: '$6',
    width: '$full',
    bg: '$btnPrimary',
    borderRadius: '$md',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '$2',
  },
  proceedButtonText: {
    fontSize: '$sm',
    color: '$white',
    fontWeight: '$medium',
  },
} as const;
