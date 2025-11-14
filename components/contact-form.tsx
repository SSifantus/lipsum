"use client";

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Textarea,
} from "@/components";
import {Formik} from "formik";
import {useRef} from "react";

interface FormValues {
  user_email: string;
  user_name: string;
  message: string;
}

interface FormErrors {
  user_email?: string;
  user_name?: string;
  message?: string;
}

export function ContactForm() {

  const statusRef = useRef<HTMLDivElement>(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
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
            try {
              const data = new FormData();
              data.append("name", values.user_name);
              data.append("email", values.user_email);
              data.append("message", values.message);

              const response = await fetch("https://formspree.io/f/xeovapel", {
                method: "POST",
                body: data,
                headers: {
                  "Accept": "application/json"
                }
              });

              if (response.ok) {
                if (statusRef.current) {
                  statusRef.current.innerHTML = "<span className='text-green-500'>Thank you for your message. Someone will get back to you shortly.</span>";
                  statusRef.current.style.display = "block";
                }
                resetForm();
              } else {
                const errorData = await response.json();
                if (statusRef.current) {
                  if (Object.hasOwn(errorData, "errors")) {
                    statusRef.current.innerHTML = errorData[ "errors" ].map((error: {
                      message: string
                    }) => error[ "message" ]).join(", ");
                  } else {
                    statusRef.current.innerHTML = "<span>There was a problem sending the message. Please try again.</span>";
                  }
                  statusRef.current.style.display = "block";
                }
              }
            } catch (error) {
              console.error("Form submission error:", error);
              if (statusRef.current) {
                statusRef.current.innerHTML = "<span>There was a problem sending the message. Please try again.</span>";
                statusRef.current.style.display = "block";
              }
            } finally {
              setSubmitting(false);
            }
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
