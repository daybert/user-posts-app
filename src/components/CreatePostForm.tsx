import React, { useState } from 'react';
import { CreatePostFormProps, FormErrors } from '../types';

export const CreatePostForm: React.FC<CreatePostFormProps> = ({
  userName,
  isSubmitting,
  submitError,
  onSubmit,
  initialOpen = false,
}) => {
  // states
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ title?: boolean; body?: boolean }>(
    {}
  );
  const [showSuccessNotice, setShowSuccessNotice] = useState(false);

  React.useEffect(() => {
    if (submitError) {
      setIsOpen(true);
    }
  }, [submitError]);

  // functions
  const validate = (currentTitle: string, currentBody: string): FormErrors => {
    const newErrors: FormErrors = {};
    const trimmedTitle = currentTitle.trim();
    const trimmedBody = currentBody.trim();

    if (!trimmedTitle) {
      newErrors.title = 'El título es obligatorio.';
    } else if (trimmedTitle.length < 3) {
      newErrors.title = 'El título debe tener al menos 3 caracteres.';
    }

    if (!trimmedBody) {
      newErrors.body = 'El texto de la publicación es obligatorio.';
    } else if (trimmedBody.length < 5) {
      newErrors.body = 'El texto debe tener al menos 5 caracteres.';
    }

    return newErrors;
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (touched.title) {
      const fieldErrors = validate(val, body);
      setErrors((prev) => ({ ...prev, title: fieldErrors.title }));
    }
  };

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setBody(val);
    if (touched.body) {
      const fieldErrors = validate(title, val);
      setErrors((prev) => ({ ...prev, body: fieldErrors.body }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ title: true, body: true });

    const validationErrors = validate(title, body);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const success = await onSubmit(title, body);
    if (success) {
      setTitle('');
      setBody('');
      setErrors({});
      setTouched({});
      setShowSuccessNotice(true);
      setTimeout(() => {
        setShowSuccessNotice(false);
        setIsOpen(false);
      }, 2500);
    }
  };

  const handleCloseForm = () => {
    setIsOpen(false);
    setTitle('');
    setBody('');
    setErrors({});
    setTouched({});
    setShowSuccessNotice(false);
  };

  return (
    <div className="create-post-section">
      {!isOpen ? (
        <button
          type="button"
          className="btn-primary open-form-btn"
          onClick={() => setIsOpen(true)}
          aria-expanded={false}
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            stroke="currentColor"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Nueva publicación para {userName}
        </button>
      ) : (
        <div
          className="create-post-card"
          role="region"
          aria-label="Formulario para crear publicación"
        >
          <div className="card-top-bar">
            <div className="card-top-title">
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              <h3>Nueva publicación como {userName}</h3>
            </div>
            <button
              type="button"
              className="btn-ghost-close"
              aria-label="Cerrar formulario"
              onClick={handleCloseForm}
              disabled={isSubmitting}
            >
              ×
            </button>
          </div>

          {showSuccessNotice && (
            <div className="success-banner" role="status" aria-live="polite">
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                stroke="currentColor"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>
                ¡Publicación creada exitosamente y añadida a la lista!
              </span>
            </div>
          )}

          {submitError && (
            <div className="error-banner" role="alert">
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{submitError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="post-title" className="form-label">
                Título <span className="required-asterisk">*</span>
              </label>
              <input
                id="post-title"
                name="title"
                type="text"
                placeholder="Ej. Novedades del proyecto..."
                value={title}
                onChange={handleTitleChange}
                onBlur={() => setTouched((prev) => ({ ...prev, title: true }))}
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? 'title-error' : undefined}
                disabled={isSubmitting}
                className={`form-input ${errors.title ? 'input-error' : ''}`}
              />
              {errors.title && (
                <p
                  id="title-error"
                  className="field-error-message"
                  role="alert"
                >
                  {errors.title}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="post-body" className="form-label">
                Texto de la publicación{' '}
                <span className="required-asterisk">*</span>
              </label>
              <textarea
                id="post-body"
                name="body"
                rows={4}
                placeholder="Escribe aquí el contenido detallado de la publicación..."
                value={body}
                onChange={handleBodyChange}
                onBlur={() => setTouched((prev) => ({ ...prev, body: true }))}
                aria-invalid={!!errors.body}
                aria-describedby={errors.body ? 'body-error' : undefined}
                disabled={isSubmitting}
                className={`form-textarea ${errors.body ? 'input-error' : ''}`}
              />
              {errors.body && (
                <p id="body-error" className="field-error-message" role="alert">
                  {errors.body}
                </p>
              )}
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={handleCloseForm}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="button-spinner" aria-hidden="true" />
                    Publicando...
                  </>
                ) : (
                  <>
                    <svg
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                    Publicar
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
