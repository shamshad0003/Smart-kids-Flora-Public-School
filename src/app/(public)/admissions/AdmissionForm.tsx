"use client";

import React, { useActionState, useEffect, useRef } from "react";
import { submitAdmission, AdmissionState } from "@/app/(public)/actions/admissions";
import { Loader2, CheckCircle, AlertCircle, Send } from "lucide-react";

const initialState: AdmissionState = {
    message: "",
};

export default function AdmissionForm() {
    const [state, formAction, isPending] = useActionState(submitAdmission, initialState);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state?.success) {
            formRef.current?.reset();
        }
    }, [state?.success]);

    return (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-12">
            <div className="mb-8">
                <h3 className="text-3xl font-extrabold text-slate-900 mb-2">Apply <span className="text-primary">Online</span></h3>
                <p className="text-slate-500">Fill out the form below to start the admission process. Our admissions office will get back to you shortly.</p>
            </div>

            {state?.success && (
                <div className="mb-8 p-6 bg-green-50 rounded-2xl border border-green-200 flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-600 shrink-0" />
                    <div>
                        <h4 className="font-bold text-green-900">Application Received!</h4>
                        <p className="text-green-800 text-sm mt-1">{state.message}</p>
                    </div>
                </div>
            )}

            {state?.success === false && state?.message && (
                <div className="mb-8 p-4 bg-red-50 rounded-xl border border-red-200 flex items-center space-x-3 text-red-700 text-sm">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <span>{state.message}</span>
                </div>
            )}

            <form ref={formRef} action={formAction} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Student Name */}
                    <div className="space-y-2">
                        <label htmlFor="studentName" className="text-sm font-bold text-slate-700">Student's Full Name *</label>
                        <input
                            type="text"
                            id="studentName"
                            name="studentName"
                            placeholder="e.g., John Doe"
                            className={`w-full p-4 rounded-xl border ${state?.errors?.studentName ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-primary focus:ring-primary/10'} bg-slate-50 focus:outline-none focus:ring-4 transition-all`}
                        />
                        {state?.errors?.studentName && <p className="text-xs text-red-500 font-medium mt-1">{state.errors.studentName[0]}</p>}
                    </div>

                    {/* Parent Name */}
                    <div className="space-y-2">
                        <label htmlFor="parentName" className="text-sm font-bold text-slate-700">Parent/Guardian Name *</label>
                        <input
                            type="text"
                            id="parentName"
                            name="parentName"
                            placeholder="e.g., Richard Doe"
                            className={`w-full p-4 rounded-xl border ${state?.errors?.parentName ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-primary focus:ring-primary/10'} bg-slate-50 focus:outline-none focus:ring-4 transition-all`}
                        />
                        {state?.errors?.parentName && <p className="text-xs text-red-500 font-medium mt-1">{state.errors.parentName[0]}</p>}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Email */}
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-bold text-slate-700">Email Address *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="e.g., parent@example.com"
                            className={`w-full p-4 rounded-xl border ${state?.errors?.email ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-primary focus:ring-primary/10'} bg-slate-50 focus:outline-none focus:ring-4 transition-all`}
                        />
                        {state?.errors?.email && <p className="text-xs text-red-500 font-medium mt-1">{state.errors.email[0]}</p>}
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-bold text-slate-700">Phone Number *</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            placeholder="e.g., 0300 1234567"
                            className={`w-full p-4 rounded-xl border ${state?.errors?.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-primary focus:ring-primary/10'} bg-slate-50 focus:outline-none focus:ring-4 transition-all`}
                        />
                        {state?.errors?.phone && <p className="text-xs text-red-500 font-medium mt-1">{state.errors.phone[0]}</p>}
                    </div>
                </div>

                {/* Grade */}
                <div className="space-y-2">
                    <label htmlFor="grade" className="text-sm font-bold text-slate-700">Applying for Grade *</label>
                    <select
                        id="grade"
                        name="grade"
                        className={`w-full p-4 rounded-xl border ${state?.errors?.grade ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-slate-200 focus:border-primary focus:ring-primary/10'} bg-slate-50 focus:outline-none focus:ring-4 transition-all appearance-none`}
                    >
                        <option value="">Select Grade</option>
                        <optgroup label="Primary School">
                            <option value="Playgroup">Playgroup</option>
                            <option value="Nursery">Nursery</option>
                            <option value="Prep">Prep</option>
                            <option value="Class 1">Class 1</option>
                            <option value="Class 2">Class 2</option>
                            <option value="Class 3">Class 3</option>
                            <option value="Class 4">Class 4</option>
                            <option value="Class 5">Class 5</option>
                        </optgroup>
                        <optgroup label="Middle School">
                            <option value="Class 6">Class 6</option>
                            <option value="Class 7">Class 7</option>
                            <option value="Class 8">Class 8</option>
                        </optgroup>
                        <optgroup label="Secondary School">
                            <option value="Class 9">Class 9</option>
                            <option value="Class 10">Class 10</option>
                        </optgroup>
                    </select>
                    {state?.errors?.grade && <p className="text-xs text-red-500 font-medium mt-1">{state.errors.grade[0]}</p>}
                </div>

                {/* Message */}
                <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-bold text-slate-700">Message (Optional)</label>
                    <textarea
                        id="message"
                        name="message"
                        rows={4}
                        placeholder="Any additional information or questions..."
                        className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none"
                    ></textarea>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-4 bg-primary text-white font-extrabold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Submitting Application...</span>
                        </>
                    ) : (
                        <>
                            <span>Submit Application</span>
                            <Send className="h-5 w-5" />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
