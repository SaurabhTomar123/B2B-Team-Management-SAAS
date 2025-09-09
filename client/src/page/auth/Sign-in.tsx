import { useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
// ... keep other imports

const SignIn = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");

  const disableAuth = import.meta.env.VITE_DISABLE_AUTH === "true";

  useEffect(() => {
    if (disableAuth) {
      // 🚀 Redirect to dashboard/workspace directly in dev
      navigate(returnUrl || "/workspace/dev", { replace: true });
    }
  }, [disableAuth, navigate, returnUrl]);

  if (disableAuth) {
    return null; // Don't render login UI while redirecting
  }

  // ⬇️ Your existing login form stays the same ⬇️
  const { mutate, isPending } = useMutation({
    mutationFn: loginMutationFn,
  });

  const formSchema = z.object({
    email: z.string().trim().email("Invalid email address").min(1, {
      message: "Workspace name is required",
    }),
    password: z.string().trim().min(1, {
      message: "Password is required",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isPending) return;

    mutate(values, {
      onSuccess: (data) => {
        const user = data.user;
        const decodedUrl = returnUrl ? decodeURIComponent(returnUrl) : null;
        navigate(decodedUrl || `/workspace/${user.currentWorkspace}`);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      {/* ⬆️ keep your existing JSX code here ⬆️ */}
    </div>
  );
};

export default SignIn;
