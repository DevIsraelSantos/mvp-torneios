import { signIn } from "@/auth";
import { GoogleIcon } from "@/components/svg/google";
import { Button } from "@/components/ui/button";

export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirect: true, redirectTo: "/" });
      }}
    >
      <Button type="submit" variant={"outline"}>
        Login <GoogleIcon className="w-6 h-6" />
      </Button>
    </form>
  );
}
