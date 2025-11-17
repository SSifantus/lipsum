"use client";

import {useRef} from "react";
import {Formik} from "formik";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Textarea,
} from "@/components";
import {sendForm} from "@/lib/actions";


interface FormErrors {
  user_email?: string;
  user_name?: string;
  message?: string;
}

interface ContactFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function ContactForm(props: ContactFormProps) {
  const {open, setOpen} = props;

  const statusRef = useRef<HTMLDivElement>(null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Contact Us</DialogTitle>
          <DialogDescription>
            Comments? Suggestions? We&apos;d love to hear from you! Send us a message using the following form.
          </DialogDescription>
        </DialogHeader>
        <Formik
          initialValues={{user_email: "", user_name: "", message: ""}}
          validate={values => {
            const errors: FormErrors = {};
            if (!values.user_email) {
              errors.user_email = "Required";
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.user_email)
            ) {
              errors.user_email = "Invalid email address";
            }
            if (!values.user_name) {
              errors.user_name = "Required";
            }
            if (!values.message) {
              errors.message = "Required";
            }
            return errors;
          }}
          onSubmit={async (values, {setSubmitting, resetForm}) => {
            const result = await sendForm({
              name: values.user_name,
              email: values.user_email,
              message: values.message
            });

            if (statusRef.current) {
              if (result.success) {
                statusRef.current.innerHTML = `<span className='text-green-500'>${result.message}</span>`;
                statusRef.current.style.display = "block";
                resetForm();
              } else {
                const errorMessage = result.errors
                  ? result.errors.join(", ")
                  : result.message || "There was a problem sending the message. Please try again.";
                statusRef.current.innerHTML = `<span>${errorMessage}</span>`;
                statusRef.current.style.display = "block";
              }
            }
            setSubmitting(false);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
          }) => (
            <form onSubmit={handleSubmit} className="grid gap-4">

              <div className="grid gap-3">
                <Label htmlFor="user_name">Name</Label>
                <Input
                  type="text"
                  placeholder="Name"
                  name="user_name"
                  id="user_name"
                  required
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.user_name}
                  hasError={!!(errors.user_name && touched.user_name)}
                  message={errors.user_name && touched.user_name ? errors.user_name : ""}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="user_email">Email</Label>
                <Input
                  type="email"
                  id="user_email"
                  placeholder="Email"
                  name="user_email"
                  required
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.user_email}
                  hasError={!!(errors.user_email && touched.user_email)}
                  message={errors.user_email && touched.user_email ? errors.user_email : ""}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  placeholder="Your message"
                  name="message"
                  id="message"
                  required
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.message}
                  hasError={!!(errors.message && touched.message)}
                  message={errors.message && touched.message ? errors.message : ""}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit"
                  disabled={isSubmitting}>{isSubmitting ? "Sending..." : "Send Message"}</Button>


              </DialogFooter>
              <div
                ref={statusRef}
                className="form-status alert-success text-xs text-right w-full"
                style={{"display": "none"}}
              />
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>);
}
