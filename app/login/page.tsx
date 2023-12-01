import Form from "@/components/Form";

export default function Login() {
  return (
    <div className="page justify-center">
        <h2 className="text-center">Sign In</h2>
        <p className="text-sm text-center text-gray-50">
          Use your email and password to sign in
        </p>
      <div className="mx-auto w-max">
        <Form type="login" />
      </div>
    </div>
  );
}
