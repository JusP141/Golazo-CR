import { createClient } from "@/app/lib/supabase-server";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("rol")
    .eq("id", user.id)
    .single();

  if (perfil?.rol !== "admin") redirect("/");

  const formData = await request.formData();
  const userId = formData.get("userId") as string;
  const rolActual = formData.get("rolActual") as string;
  const nuevoRol = rolActual === "admin" ? "usuario" : "admin";

  await supabase.from("perfiles").update({ rol: nuevoRol }).eq("id", userId);

  return Response.redirect(new URL("/admin/usuarios", request.url));
}
