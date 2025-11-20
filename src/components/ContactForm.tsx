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
        <div className="w-full h-full flex items-center justify-center min-h-screen-minus-header">
            <div className="text-8xl font-serif font-light">hello@becomingplugins.com</div>
        </div>
    );
}
