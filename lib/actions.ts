"use server";

interface SendFormParams {
  name: string;
  email: string;
  message: string;
}

interface SendFormResult {
  success: boolean;
  message?: string;
  errors?: string[];
}

export async function sendForm(params: SendFormParams): Promise<SendFormResult>{
  try {
    const data = new FormData();
    data.append("name", params.name);
    data.append("email", params.email);
    data.append("message", params.message);

    const formspreeUrl = process.env.FORMSPREE_URL;
    if(!formspreeUrl) {
      return {
        success:false,
        message:"Form submission endpoint is not configured."
      };
    }

    const response = await fetch(formspreeUrl, {
      method:"POST",
      body:data,
      headers:{
        "Accept":"application/json"
      }
    });

    if(response.ok) {
      return {
        success:true,
        message:"Thank you for your message. Someone will get back to you shortly."
      };
    } else {
      const errorData = await response.json();
      if(Object.hasOwn(errorData, "errors")) {
        return {
          success:false,
          errors:errorData.errors.map((error: {message: string}) => error.message)
        };
      } else {
        return {
          success:false,
          message:"There was a problem sending the message. Please try again."
        };
      }
    }
  } catch (error) {
    console.error("Form submission error:", error);
    return {
      success:false,
      message:"There was a problem sending the message. Please try again."
    };
  }
}
