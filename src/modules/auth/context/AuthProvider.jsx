import { createContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import supabase from "../../../config/supabase";
import { useMutation } from "@tanstack/react-query";

export const AuthContext = createContext(null);

export default function AuthProvider() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const addUserMutation = useMutation({
    mutationFn: (newUser) => supabase.from("user").insert(newUser),
  });

  useEffect(() => {
    // supabase.auth.getSession().then(({ data: { session } }) => {
    //   setSession(session);
    // });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);

      if (session) {
        const { email, full_name, avatar_url } = session.user.user_metadata;
        supabase
          .from("user")
          .select()
          .eq("email", email)
          .single()
          .then((res) => {
            if (!res.data) {
              addUserMutation.mutate(
                { email, full_name, avatar: avatar_url },
                { onSuccess: () => navigate("/login") }
              );
            } else {
              if (res.data.role_id === 2) {
                navigate("/");
              } else {
                navigate("/login");
              }
            }
          });
      } else {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogin() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider
      value={{
        session: session,
        onLogin: handleLogin,
        onLogout: handleLogout,
      }}
    >
      <Outlet />
    </AuthContext.Provider>
  );
}
