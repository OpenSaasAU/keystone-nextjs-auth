import { useEffect, useState } from 'react';

export function useForm(initial = {}) {
  // create a state object for our inputs
  const [inputs, setInputs] = useState(initial);
  const initialValues = Object.values(initial).join('');

  useEffect(() => {
    // This function runs when the things we are watching change
    setInputs(initial);
  }, [initialValues]);

  function handleStageButton(e) {
    const { innerText } = e.target;
    const value = innerText.toLowerCase();
    console.log(value);
    setInputs({
      ...inputs,
      stage: value,
    });
  }
  function handleChange(e) {
    let { value, name, type } = e.target;
    if (type === 'number') {
      value = parseInt(value);
    }
    if (type === 'checkbox') {
      value = !inputs[name];
    }
    if (type === 'radio') {
      if (value === 'yes') {
        value = true;
      } else if (value === 'no') {
        value = false;
      } else if (name === 'feeAmount') {
        value = parseInt(value);
      }
    }
    if (type === 'file') {
      [value] = e.target.files;
    }
    setInputs({
      // copy the existing state
      ...inputs,
      [name]: value,
    });
  }

  function resetForm() {
    setInputs(initial);
  }

  function clearForm() {
    const blankState = Object.fromEntries(
      Object.entries(inputs).map(([key, value]) => [key, ''])
    );
    setInputs(blankState);
  }

  // return the things we want to surface from this custom hook
  return {
    inputs,
    handleChange,
    handleStageButton,
    resetForm,
    clearForm,
  };
}
