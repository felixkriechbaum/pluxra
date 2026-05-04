const _editMode = ref(false)

export function useGrid() {
  function toggleEditMode() {
    _editMode.value = !_editMode.value
  }

  return { editMode: readonly(_editMode), toggleEditMode }
}
