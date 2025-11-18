"use client";

import classNames from "classnames";
import { useState } from "react";
import Container from "./Container";
import Button from "./ui/Button";

interface FormState {
    name: string;
    email: string;
    topic: string;
    website: string;
    message: string;
}

export default function ContactForm() {
    const [form, setForm] = useState<FormState>({
        name: "",
        email: "",
        topic: "",
        website: "",
        message: "",
    });
    const [errors, setErrors] = useState<Partial<FormState>>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState<null | { ok: boolean; id?: string }>(null);

    const onChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
        setErrors((err) => ({ ...err, [name]: undefined }));
    };

    const validate = () => {
        const newErrors: Partial<FormState> = {};
        if (!form.name.trim()) newErrors.name = "What's your name?";
        if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
            newErrors.email = "We need a valid email";
        if (!form.topic) newErrors.topic = "Pick a topic";
        if (form.website && !/^https?:\/\//i.test(form.website))
            newErrors.website = "Include http(s)://";
        if (!form.message.trim()) newErrors.message = "Tell us a bit more";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        try {
            setSubmitting(true);
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            setSubmitted({ ok: res.ok, id: data?.id });
            if (res.ok) setForm({ name: "", email: "", topic: "", website: "", message: "" });
        } catch {
            setSubmitted({ ok: false });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container>
            {/* <h1 className="font-serif text-8xl mb-8 text-foreground">
          Let&apos;s talk
        </h1> */}

            <form onSubmit={handleSubmit} className="space-y-6 text-foreground text-[4vw] font-serif">
                <p>Dear Becoming,</p>
                <p className="leading-[1.5]">My name is <input
                    className="form-input text-accent"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                /> and I need help with <input
                        className="form-input"
                        type="text"
                        name="topic"
                        value={form.topic}
                        onChange={onChange}
                    />. You can reach me at <input
                        className="form-input"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={onChange}
                    /> and my squarespace website URL is <input
                        className="form-input"
                        type="url"
                        name="website"
                        value={form.website}
                        onChange={onChange}
                    />.</p>
                {/* Single paragraph: Name + Topic + Email + Website */}

                {/* <div className="leading-relaxed">
                    <p>Dear Becoming,</p>
                    <p>My name is <label
                    className="leading-[1.2]"
                    ><input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={onChange}
                        className={classNames(
                            "leading-[1.2] ml-2 bg-transparent outline-none text-accent text-center h-full border-b border-foreground",
                            "placeholder:text-foreground/40 max-w-md",
                        )}
                    /></label> and my website URL is <label><input
                        type="url"
                        name="website"
                        value={form.website}
                        onChange={onChange}
                        className={classNames(
                            "ml-2 bg-transparent underline-dash outline-none text-center",
                            "placeholder:text-foreground/40",
                        )}
                    /></label></p>
                </div> */}
                {/* <div className="leading-relaxed">
            <label className="block">
              <span>Hi, my name is</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Ada Lovelace"
                className={classNames(
                  "ml-2 bg-transparent underline-dash outline-none",
                  "placeholder:text-foreground/40",
                )}
              />
              <span className="ml-2">and I&apos;m needing help with</span>
              <Select
                name="topic"
                value={form.topic}
                options={TOPICS}
                placeholder="select a topic"
                onValueChange={(val) => {
                  setForm((f) => ({ ...f, topic: val }));
                  setErrors((err) => ({ ...err, topic: undefined }));
                }}
                className="align-baseline"
              />
              <span className="ml-2">. You can reach me at</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="you@domain.com"
                className={classNames(
                  "ml-2 bg-transparent underline-dash outline-none",
                  "placeholder:text-foreground/40",
                )}
              />
              <span className="ml-2">and my website is</span>
              <input
                type="url"
                name="website"
                value={form.website}
                onChange={onChange}
                placeholder="https://example.com (optional)"
                className={classNames(
                  "ml-2 bg-transparent underline-dash outline-none",
                  "placeholder:text-foreground/40",
                )}
              />
              <span className="ml-2">.</span>
            </label>
          </div>
          <div className="text-accent space-y-1">
            {(errors.name || errors.topic || errors.email || errors.website) && (
              <ul className="text-sm list-none m-0 p-0">
                {errors.name && <li>• {errors.name}</li>}
                {errors.topic && <li>• {errors.topic}</li>}
                {errors.email && <li>• {errors.email}</li>}
                {errors.website && <li>• {errors.website}</li>}
              </ul>
            )}
          </div>

          {/* Line 3: Message */}
                <div className="leading-relaxed">
                    <label className="block">
                        <span>Here&apos;s the gist:</span>
                    </label>
                    <textarea
                        name="message"
                        value={form.message}
                        onChange={onChange}
                        rows={4}
                        placeholder="Tell us what's up, and we'll jump in."
                        className={classNames(
                            "mt-2 w-full bg-transparent border border-foreground/20 rounded-xl p-4",
                            "focus:border-foreground outline-none placeholder:text-foreground/40",
                        )}
                    />
                </div>
                <div className="text-accent">
                    {errors.message && <p>• {errors.message}</p>}
                </div>

                {/* Submit */}
                <div className="flex items-center gap-3">
                    <Button type="submit" size="lg" variant="primary" disabled={submitting}>
                        {submitting ? "Sending…" : "Send it"}
                    </Button>
                    {submitted && (
                        <span className={classNames("text-sm", submitted.ok ? "text-foreground" : "text-accent")}>
                            {submitted.ok ? "Thanks! We'll be in touch." : "Hmm, something went wrong. Try again?"}
                        </span>
                    )}
                </div>
            </form>
        </Container>
    );
}
