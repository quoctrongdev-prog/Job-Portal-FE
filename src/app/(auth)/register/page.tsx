"use client";
import { auth_service, useAppData } from "@/context/AppContext";
import axios from "axios";
import { redirect } from "next/navigation";
import React, { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { Label } from "@/components/ui/label";
import { ArrowRight, Briefcase, FileText, Lock, Mail, Phone, Text } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loading from "@/components/ui/loading";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bio, setBio] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  //tac dung cua context ko can truyen qua props do roi
  //destructuring tu useAppData (useContext)
  const { isAuth, setUser, loading, setIsAuth } = useAppData();

  if (loading) return <Loading />;

  if (isAuth) return redirect("/");

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setBtnLoading(true);

    //“form” ảo để chứa dữ liệu key-value (kiểu như form HTML)
    const formData = new FormData();

    //append: them   key  , value
    formData.append("role", role);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("phoneNumber", phoneNumber);

    if (role === "jobseeker") {
      formData.append("bio", bio);
      if (resume) {
        formData.append("file", resume);
      }
    }
    try {
      const { data } = await axios.post(
        `${auth_service}/api/auth/register`,
        formData,
      );
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
      setUser(data.registeredUser);
      setIsAuth(true);

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
          <h1 className="text-4xl font-bold mb-2">Join HireHeaven</h1>
          <p className="text-sm opacity-70">
            Create your account to start a new jorney
          </p>
        </div>
        <div className="border border-gray-400 rounded-2xl p-8 shadow-lg backdrop-blur-sm">
          <form onSubmit={submitHandler} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium">
                I want to
              </Label>
              <div className="relative">
                <Briefcase className="icon-style" />
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 border-2 border-gray-300 rounded-md
                  bg-transparent dark:bg-black cursor-pointer"
                  required
                >
                  <option value="">Select your role</option>
                  <option value="jobseeker">Find a Job</option>
                  <option value="recruiter">Hire Talent</option>
                </select>
              </div>
            </div>

            {role && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <div className="relative">
                    <Lock className="icon-style" />
                    <Input
                      type="text"
                      id="name"
                      placeholder="Nguyen Van A"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="pl-10 h-11"
                    />
                  </div>
                </div>

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

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="icon-style" />
                    <Input
                      type="number"
                      id="phone"
                      placeholder="+84 1234567890"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      className="pl-10 h-11"
                    />
                  </div>
                </div>

                {role === "jobseeker" && (
                  <div
                    className="space-y-5 pt-4 "
                  >
                    <div className="space-y-2">
                      <Label htmlFor="resume" className="text-sm font-medium">
                        Resume (PDF)
                      </Label>
                      <div className="relative">
                        
                        <Input
                          type="file"
                          id="resume"
                          accept="application/pdf"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setResume(e.target.files[0]);
                            }
                          }}
                          className="h-11 cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-sm font-medium">
                        Bio
                      </Label>
                      <div className="relative">
                        <FileText className="icon-style" />
                        <Input
                          type="text"
                          id="bio"
                          placeholder="Tell us about yourself..."
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          required
                          className="pl-10 h-11"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <Button disabled={btnLoading} className="w-full cursor-pointer">
                  {btnLoading ? "Please Wait..." : "Register"}
                  <ArrowRight size={18} />
                </Button>
              </div>
            )}
          </form>

          <div className="mt-6 pt-6 border-t border-gray-400">
            <p className="text-center text-sm">
              Already have an account{" "}
              <Link
                href={"/login"}
                className="text-blue-500
              font-medium hover:underline transition-all"
              >
                Login?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
