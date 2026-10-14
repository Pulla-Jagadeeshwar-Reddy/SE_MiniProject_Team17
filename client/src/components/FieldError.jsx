/** Shows a validation message next to a form field: <FieldError message={errors.title} /> */
export default function FieldError({ message, id }) {
  if (!message) return null;
  return (
    <p className="field-error" id={id} role="alert">
      {message}
    </p>
  );
}
