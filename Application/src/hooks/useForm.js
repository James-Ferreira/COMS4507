import { useState } from "react";

function useForm(initialState, verifier, submitter) {
  const [formData, setFormData] = useState(initialState);

  const set = (prop, val) => {
    setFormData({ ...formData, [prop]: val });
  };

  const submit = async () => {
    if (!submitter) throw new Error("No submitter function provided.");
    return await submitter(formData);
  };

  const verify = async () => {
    if (!verifier) throw new Error("No verifier function provided.");
    return await verifier(formData);
  };

  return { ...formData, set, verify, submit };
}

export default useForm;
