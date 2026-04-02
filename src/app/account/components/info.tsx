import React, { ChangeEvent, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Camera,
  Edit2,
  FileText,
  Mail,
  NotepadText,
  Phone,
  UserIcon,
} from "lucide-react"; // Cần cài lucide-react (có sẵn trong shadcn)
import { AccountProps } from "@/types";
import Link from "next/link";
import { Form } from "radix-ui";
import toast from "react-hot-toast";
import { useAppData } from "@/context/AppContext";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const Info: React.FC<AccountProps> = ({ user, isYourAccount }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const editRef = useRef<HTMLButtonElement | null>(null);
  const resumeRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bio, setBio] = useState("");

  const { updateProfilePic, updateResume, btnLoading, updateUser } = useAppData();

  const handleClick = () => {
    inputRef.current?.click();
  };

  //Thay doi anh profile
  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      updateProfilePic(formData);
    }
  };

  const handleEditClick = () => {
    editRef.current?.click();
    setName(user.name);
    setPhoneNumber(user.phone_number);
    setBio(user.bio || "");
  };

  const updateProfileHandler = () => {
    updateUser(name, phoneNumber, bio);
  };

  const handleResumeClick = () => {
    resumeRef.current?.click();
  };

  //Thay doi Resume
  const changeResume = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Please upload a PDF file");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      updateResume(formData);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* 1. Card chính: KHÔNG dùng overflow-hidden để avatar lòi ra được */}
      <Card className="relative shadow-xl border-none bg-card overflow-visible">
        {/* 2. Banner/Header màu xanh */}
        <div className="h-40 w-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-t-xl relative">
          {/* 3. Avatar dùng Shadcn UI Component */}
          <div className="absolute -bottom-16 left-8 md:left-12">
            <div className="relative group">
              <Avatar className="w-32 h-32 border-4 border-background shadow-2xl">
                <AvatarImage
                  src={user.profile_pic || "/work2.jpg"}
                  className="object-cover"
                />
                <AvatarFallback className="text-2xl bg-muted">
                  {user.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>

              {/* Nút đổi ảnh (Chỉ hiện khi di chuột vào và là chủ tài khoản) */}
              {isYourAccount && (
                <>
                  <div
                    onClick={handleClick}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Camera className="text-white w-6 h-6" />
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    ref={inputRef}
                    onChange={changeHandler}
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* 4. Nội dung phía dưới - Dùng pt-20 để "né" cái avatar đang đè lên */}
        <div className="pt-20 pb-10 px-8 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            {/* Thông tin User */}
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                {user.name}
              </h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2 text-sm opacity-70">
                  <Briefcase size={16} />
                  <span className="capitalize">{user.role}</span>
                </div>
                {/* <span className="w-1 h-1 bg-muted-foreground rounded-full" /> */}
                {/* <span className="text-sm font-medium">Vietnam</span> */}
              </div>
            </div>

            {/* Nút hành động dùng Shadcn Button */}
            {isYourAccount && (
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 cursor-pointer"
                  onClick={handleEditClick}
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </Button>
                {/* <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Share Profile
                </Button> */}
              </div>
            )}
          </div>

          {/* Bạn có thể thêm Bio hoặc Stats ở đây */}
          {user.role === "jobseeker" && user.bio && (
            <div className="mt-6 p-4 rounded-lg border">
              <div
                className="flex items-center gap-2 mb-2 text-sm font-medium
              opacity-70"
              >
                <FileText size={16} />
                <span>About</span>
              </div>
              <p className="text-base leading-relaxed">{user.bio}</p>
            </div>
          )}
          {/* Contact info */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Mail size={24} className="text-blue-600" />
              Contact Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div
                className="flex items-center gap-3 p-4 rounded-lg border
              hover:border-blue-500 transition-colors"
              >
                <div
                  className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blur-900
                flex items-center justify-center"
                >
                  <Mail size={18} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs opacity-70 font-medium">Email</p>
                  <p className="text-sm truncate">{user.email}</p>
                </div>
              </div>
              <div
                className="flex items-center gap-3 p-4 rounded-lg border
              hover:border-blue-500 transition-colors"
              >
                <div
                  className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blur-900
                flex items-center justify-center"
                >
                  <Phone size={18} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs opacity-70 font-medium">Phone</p>
                  <p className="text-sm truncate">{user.phone_number}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Resume section  */}
          {user.role === "jobseeker" && user.resume && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mt-4 flex items-center gap-2">
                <NotepadText size={24} className="text-blue-600" />
                Resume
              </h2>

              <div
                className="flex items-center gap-3 p-4 rounded-lg border
            hover:boder-blue-500 transition-colors"
              >
                <div
                  className="h-12 w-12 rounded-lg bg-red-100
              dark:bg-red-900 flex items-center justify-center"
                >
                  <NotepadText size={24} className="text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Resume Document</p>
                  {/* target="_blank" được dùng trong thẻ <a> (link) để mở 
                liên kết ở tab mới thay vì tab hiện tại. */}
                  <Link
                    href={user.resume}
                    className="text-sm text-blue-500
                hover:underline"
                    target="_blank"
                  >
                    View Resume PDF
                  </Link>
                </div>
                {/* Edit resume button  */}
                {isYourAccount && <Button
                  variant={"outline"}
                  size={"sm"}
                  onClick={handleResumeClick}
                  className="gap-2 cursor-pointer"
                >
                  Update
                </Button>}
                <input
                  type="file"
                  ref={resumeRef}
                  className="hidden"
                  accept="application/pdf"
                  onChange={changeResume}
                />
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Dialog la Popup box for update user  */}
      <Dialog>
        <DialogTrigger asChild>
          <Button ref={editRef} variant={"outline"} className="hidden">
            Edit Profile
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Edit Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium flex
              items-center gap-2"
              >
                <UserIcon size={16} />
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                className="h-11"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-sm font-medium flex
              items-center gap-2"
              >
                <Phone size={16} />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="number"
                placeholder="Enter your Phone Number"
                className="h-11"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            {
              user.role === "jobseeker" && (
                 <div className="space-y-2">
              <Label
                htmlFor="bio"
                className="text-sm font-medium flex
              items-center gap-2"
              >
                <FileText size={16} />
                Bio
              </Label>
              <Input
                id="bio"
                type="text"
                placeholder="Enter your Bio"
                className="h-11"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
              )}

              <DialogFooter>
                <Button disabled={btnLoading} onClick={updateProfileHandler}
                className="w-full h-11 cursor-pointer" type="submit">
                  {btnLoading ? "Saving Changes..." : "Save Changes"}
                </Button>
              </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Info;
