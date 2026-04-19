"use client";
import { auth_service, useAppData } from "@/context/AppContext";
import axios from "axios";
import { redirect } from "next/navigation";
import React, { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { Label } from "@/components/ui/label";
import { ArrowRight, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loading from "@/components/ui/loading";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  //tac dung cua context ko can truyen qua props do roi
  //destructuring tu useAppData (useContext)
  const { isAuth, setUser, setIsAuth, loading, fetchApplications } = useAppData();

  if(loading) return <Loading />


  if (isAuth) return redirect("/");

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${auth_service}/api/auth/login`, {
        email,
        password,
      });
      toast.success(data.message);

      //Cookie: lưu chìa khóa (token/session) để server nhận ra user
      //Giu trang thai dang nhap va track hanh vi: analytics, ads,...

      //lưu token vào cookie sau khi đăng nhập
      //"token" Tên của cookie. Sau này sẽ lấy bằng: Cookies.get("token")
      Cookies.set("token", data.token, {
        //hết hạn sau 15 ngày
        expires: 15,
        //Cookie chỉ gửi qua HTTPS Tăng bảo mật
        secure: false,
        //Cookie có hiệu lực trên toàn bộ website
        path: "/",
      });
      setUser(data.userObject);
      setIsAuth(true);
      fetchApplications();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response.data.message);
      setIsAuth(false);
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back to HireHeaven
          </h1>
          <p className="text-sm opacity-70">Sign in to continue your journey</p>
        </div>
        <div className="border border-gray-400 rounded-2xl p-8 shadow-lg backdrop-blur-sm">
          <form onSubmit={submitHandler} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="icon-style" />
                <Input
                  type="email"
                  id="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="icon-style" />
                <Input
                  type="password"
                  id="password"
                  placeholder="*******"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 h-11"
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
                <Link href={'/forgot'} className="text-sm text-blue-500 hover:underline
                transition-all">
                  Forgot Password ?
                </Link>
            </div>

            <Button disabled={btnLoading} className="w-full cursor-pointer">
              {btnLoading ? "Signing in..." : "Sign In"}
              <ArrowRight size={18} />
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-400">
            <p className="text-center text-sm">
              Don&apos;t have an account? <Link href={'/register'} className="text-blue-500
              font-medium hover:underline transition-all">
                Creat a new account?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
