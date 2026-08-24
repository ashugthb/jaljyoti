"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";
import { CheckCircleIcon, CloseIcon } from "@/components/icons";
import { CONTACT } from "./siteMeta";

/**
 * One enquiry form for the whole site. Every "Get Started" / "Request a pilot
 * kit" / "Contact" control opens this dialog, which POSTs to /api/contact and
 * is stored in the Contact collection (name, email, phone, subject, message).
 */

const GetStartedContext = createContext(null);

export function useGetStarted() {
  const context = useContext(GetStartedContext);
  if (!context) {
    throw new Error("useGetStarted must be used inside <GetStartedProvider>");
  }
  return context;
}

const SUBJECTS = [
  "Request a pilot kit",
  "Book a demo",
  "Research collaboration",
  "Distribution / partnership",
  "General enquiry",
];

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  subject: SUBJECTS[0],
  message: "",
};

// Mirrors the server-side rules in /api/contact so the user is told before the
// round trip rather than after it.
function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Please tell us your name.";
  if (!form.email.trim()) {
    errors.email = "We need an email to reply to.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "That email address doesn't look right.";
  }
  if (form.phone.trim() && !/^[+\d][\d\s-]{6,}$/.test(form.phone.trim())) {
    errors.phone = "Use digits, spaces, or a leading +.";
  }
  if (!form.message.trim()) {
    errors.message = "A line or two about what you need helps us reply well.";
  }
  return errors;
}

function Field({ id, label, error, children }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block font-body text-label-md uppercase tracking-wider text-on-surface-variant"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 font-body text-body-sm text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function GetStartedDialog({ open, preset, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent
  const panelRef = useRef(null);
  const firstFieldRef = useRef(null);
  const lastFocusedRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    lastFocusedRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus the first field, and keep Tab inside the dialog while it is open.
    const focusTimer = window.setTimeout(() => firstFieldRef.current?.focus(), 120);

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (lastFocusedRef.current instanceof HTMLElement) {
        lastFocusedRef.current.focus();
      }
    };
  }, [open, onClose]);

  // Reset back to a blank form (and drop any success screen) between openings.
  useEffect(() => {
    if (open) {
      setForm({ ...EMPTY_FORM, subject: preset ?? EMPTY_FORM.subject });
      setErrors({});
      setStatus("idle");
    }
  }, [open, preset]);

  const update = (field) => (event) => {
    const { value } = event.target;
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(form);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          subject: form.subject,
          message: form.message.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setStatus("idle");
        toast.error(data.message || "We couldn't send that. Please try again.");
        return;
      }

      setStatus("sent");
      toast.success(data.message || "Message sent successfully");
    } catch (error) {
      setStatus("idle");
      toast.error(error.message || "Network error — please try again.");
    }
  };

  const fieldClass = (field) =>
    `jj-field font-body text-body-md ${errors[field] ? "jj-field-error" : ""}`;

  return (
    <div
      className={`fixed inset-0 z-[80] flex items-end justify-center p-0 transition-opacity duration-300 sm:items-center sm:p-6 ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!open}
      inert={!open}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close form"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-on-surface/30 backdrop-blur-[2px]"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="get-started-title"
        className={`relative flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] sm:rounded-[28px] ${
          open ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-[0.98] opacity-0"
        }`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-outline-variant/60 px-6 py-5 sm:px-8">
          <div>
            <h2 id="get-started-title" className="font-display text-headline-md text-on-surface">
              {status === "sent" ? "Message received" : "Get started"}
            </h2>
            <p className="mt-1 font-body text-body-sm text-on-surface-variant">
              {status === "sent"
                ? "Thanks — we have your details."
                : "Tell us what you need and we'll come back to you."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container"
          >
            <CloseIcon size={22} />
          </button>
        </div>

        {status === "sent" ? (
          <div className="flex flex-col items-center gap-4 px-6 py-14 text-center sm:px-8">
            {/* Plays once on mount — the confirmation draws itself in as the
                form swaps out. */}
            <CheckCircleIcon size={56} play="always" className="text-primary" />
            <p className="font-display text-headline-md text-on-surface">
              We&apos;ll be in touch shortly.
            </p>
            <p className="max-w-sm font-body text-body-md text-on-surface-variant">
              Your enquiry is saved and our team will reply to {form.email}. For
              anything urgent, call {CONTACT.phone}.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 rounded-xl bg-primary px-8 py-3 font-display font-bold text-on-primary transition-colors hover:bg-primary-container"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="overflow-y-auto px-6 py-6 sm:px-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field id="gs-name" label="Name *" error={errors.name}>
                <input
                  id="gs-name"
                  ref={firstFieldRef}
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={update("name")}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "gs-name-error" : undefined}
                  className={fieldClass("name")}
                  placeholder="Your full name"
                />
              </Field>

              <Field id="gs-email" label="Email *" error={errors.email}>
                <input
                  id="gs-email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={update("email")}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "gs-email-error" : undefined}
                  className={fieldClass("email")}
                  placeholder="you@organisation.org"
                />
              </Field>

              <Field id="gs-phone" label="Phone" error={errors.phone}>
                <input
                  id="gs-phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={update("phone")}
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? "gs-phone-error" : undefined}
                  className={fieldClass("phone")}
                  placeholder="+91 …"
                />
              </Field>

              <Field id="gs-subject" label="I'm here to">
                <select
                  id="gs-subject"
                  value={form.subject}
                  onChange={update("subject")}
                  className={fieldClass("subject")}
                >
                  {SUBJECTS.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </Field>

              <div className="sm:col-span-2">
                <Field id="gs-message" label="Message *" error={errors.message}>
                  <textarea
                    id="gs-message"
                    rows={4}
                    value={form.message}
                    onChange={update("message")}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "gs-message-error" : undefined}
                    className={fieldClass("message")}
                    placeholder="Where do you need water testing, and at what scale?"
                  />
                </Field>
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl bg-primary py-4 font-display font-bold text-on-primary transition-all hover:bg-primary-container active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === "sending" ? (
                <>
                  <span className="jj-spinner" aria-hidden="true" />
                  Sending…
                </>
              ) : (
                "Send enquiry"
              )}
            </button>

            <p className="mt-4 text-center font-body text-body-sm text-outline">
              Or reach us directly at {CONTACT.email}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export function GetStartedProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [preset, setPreset] = useState(null);

  const openGetStarted = useCallback((subject) => {
    setPreset(typeof subject === "string" ? subject : null);
    setOpen(true);
  }, []);

  const closeGetStarted = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ openGetStarted, closeGetStarted, isOpen: open }),
    [openGetStarted, closeGetStarted, open]
  );

  return (
    <GetStartedContext.Provider value={value}>
      {children}
      <GetStartedDialog open={open} preset={preset} onClose={closeGetStarted} />
    </GetStartedContext.Provider>
  );
}
