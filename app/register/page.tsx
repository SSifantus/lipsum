import Form from "@/components/Form";

export default function Login() {
  return (
    <div className="page justify-center">
      <h2 className="text-center">Sign Up</h2>
      <p className="text-sm text-center text-gray-50">
        Create an account with your email and password
      </p>
      <div className="mx-auto w-max">
        <Form type="register" />
      </div>
    </div>
  );
}
