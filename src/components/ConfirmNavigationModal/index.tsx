import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react'

interface ConfirmNavigationModalProps {
  when: boolean
  onCancel: any
  onConfirm: any
  ref: any
}

function ConfirmNavigationModal({
  when,
  onCancel,
  onConfirm,
  ref,
}: ConfirmNavigationModalProps) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    <AlertDialog isOpen={when} leastDestructiveRef={ref} onClose={() => {}}>
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader fontSize="lg" fontWeight="bold">
          Unsaved changes
        </AlertDialogHeader>
        <AlertDialogBody>
          Are you sure you want to leave this page? You have unsaved changes
          that will be lost.
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button onClick={onCancel}>Cancel</Button>
          <Button colorScheme="red" onClick={onConfirm} ml={3}>
            Confirm
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ConfirmNavigationModal
