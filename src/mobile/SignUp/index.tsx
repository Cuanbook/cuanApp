import React, { useState } from "react";
import { ArrowLeft, EyeIcon, EyeOffIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getApiUrl } from '@/config/api';

import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { Input } from "@components/ui/input";

export const SignUp = (): JSX.Element => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Konfirmasi password tidak cocok");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(getApiUrl("auth/register"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Pendaftaran berhasil! Silakan login.");
        navigate("/login");
      } else {
        toast.error(data.message || "Gagal mendaftar");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Terjadi kesalahan saat mendaftar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f9f9f9] min-h-screen flex flex-col justify-center items-center w-full">
      <div className="w-full max-w-[390px] min-h-[100dvh] px-4 py-8">
        <form onSubmit={handleSubmit}>
          <div className="relative w-full h-full">
            <div className="flex flex-col w-full h-full items-start">
              {/* Header with back button and title */}
              <div className="flex items-center w-full mb-8 relative">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="absolute left-0 p-2"
                >
                  <ArrowLeft className="w-6 h-6 text-[#111611]" />
                </button>
                <div className="flex-1 text-center">
                  <h1 className="font-bold text-[#111611] text-lg font-['Manrope',Helvetica]">
                    Daftar
                  </h1>
                </div>
              </div>

              {/* Email input */}
              <div className="w-full mb-4">
                <Card className="border-none w-full">
                  <CardContent className="p-0">
                    <Input
                      className="h-14 bg-[#ebf2e8] text-[#639154] border-none rounded-xl font-['Inter',Helvetica]"
                      placeholder="Email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Password input */}
              <div className="w-full mb-4">
                <div className="relative">
                  <Card className="border-none">
                    <CardContent className="p-0">
                      <Input
                        className="h-14 bg-[#ebf2e8] text-[#639154] border-none rounded-xl font-['Inter',Helvetica] pr-12"
                        placeholder="Password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CardContent>
                  </Card>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#639154] hover:text-[#4b6e3f] transition-colors"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password input */}
              <div className="w-full mb-6">
                <div className="relative">
                  <Card className="border-none">
                    <CardContent className="p-0">
                      <Input
                        className="h-14 bg-[#ebf2e8] text-[#639154] border-none rounded-xl font-['Inter',Helvetica] pr-12"
                        placeholder="Konfirmasi Password"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                      />
                    </CardContent>
                  </Card>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#639154] hover:text-[#4b6e3f] transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Sign Up button */}
              <div className="w-full mb-4">
                <Button
                  type="submit"
                  className="w-full h-12 bg-[#54d12b] hover:bg-[#4bc026] text-[#12190f] rounded-3xl font-bold shadow-[0px_4px_4px_#00000040] font-['Inter',Helvetica]"
                  disabled={loading}
                >
                  {loading ? "Mendaftar..." : "Daftar"}
                </Button>
              </div>

              {/* Terms text */}
              <div className="w-full text-center mb-4">
                <p className="font-normal text-[#639154] text-xs leading-[18px] font-['Inter',Helvetica]">
                  Dengan mendaftar, Anda setuju dengan{" "}
                  <span className="text-[#54d12b] cursor-pointer">
                    Syarat & Ketentuan
                  </span>
                  {" "}dan{" "}
                  <span className="text-[#54d12b] cursor-pointer">
                    Kebijakan Privasi
                  </span>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};