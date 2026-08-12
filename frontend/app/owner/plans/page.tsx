"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Edit3,
  IndianRupee,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import OwnerNavbar from "@/app/components/navbar";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Plan = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isActive: boolean;
};

export default function ManagePlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);

  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");

  const [showAdd, setShowAdd] = useState(false);

  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");

  function getToken() {
    if (typeof window === "undefined") return null;

    return (
      localStorage.getItem("ownerToken") ||
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken")
    );
  }

  async function loadPlans() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/plans`, {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load plans."
        );
      }

      setPlans(data.plans || []);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load plans."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPlans();
  }, []);

  function startEditing(plan: Plan) {
    setEditingId(plan.id);

    setEditName(plan.name);
    setEditDescription(plan.description || "");
    setEditPrice(String(plan.price));
    setEditImageUrl(plan.imageUrl || "");

    setError("");
    setSuccess("");
  }

  function cancelEditing() {
    setEditingId(null);

    setEditName("");
    setEditDescription("");
    setEditPrice("");
    setEditImageUrl("");
  }

  async function savePlan(id: number) {
    const token = getToken();

    if (!token) {
      setError(
        "Owner authentication token not found. Please login again."
      );
      return;
    }

    if (!editName.trim()) {
      setError("Plan name is required.");
      return;
    }

    const price = Number(editPrice);

    if (!Number.isFinite(price) || price < 0) {
      setError("Please enter a valid price.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/api/owner/plans/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editName.trim(),
            description: editDescription.trim(),
            price,
            imageUrl: editImageUrl.trim() || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to update plan."
        );
      }

      setSuccess("Plan updated successfully.");

      cancelEditing();

      await loadPlans();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update plan."
      );
    } finally {
      setSaving(false);
    }
  }

  async function createPlan(event: FormEvent) {
    event.preventDefault();

    const token = getToken();

    if (!token) {
      setError(
        "Owner authentication token not found. Please login again."
      );
      return;
    }

    if (!newName.trim()) {
      setError("Plan name is required.");
      return;
    }

    const price = Number(newPrice);

    if (!Number.isFinite(price) || price < 0) {
      setError("Please enter a valid price.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/api/owner/plans`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: newName.trim(),
            description: newDescription.trim(),
            price,
            imageUrl: newImageUrl.trim() || null,
            isActive: true,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to create plan."
        );
      }

      setSuccess("New plan created successfully.");

      setNewName("");
      setNewDescription("");
      setNewPrice("");
      setNewImageUrl("");
      setShowAdd(false);

      await loadPlans();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to create plan."
      );
    } finally {
      setSaving(false);
    }
  }

  async function togglePlan(plan: Plan) {
    const token = getToken();

    if (!token) {
      setError(
        "Owner authentication token not found."
      );
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/api/owner/plans/${plan.id}/toggle`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to change plan status."
        );
      }

      setSuccess(data.message);

      await loadPlans();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to change plan status."
      );
    }
  }

  async function deletePlan(plan: Plan) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${plan.name}"?`
    );

    if (!confirmed) return;

    const token = getToken();

    if (!token) {
      setError(
        "Owner authentication token not found."
      );
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/api/owner/plans/${plan.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to delete plan."
        );
      }

      setSuccess(data.message);

      await loadPlans();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete plan."
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      {/* NAVBAR */}

      <OwnerNavbar/>
      <div className="mx-auto max-w-[1400px] px-5 py-10 lg:px-8 lg:py-14">
        {/* HEADER */}

        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/30">
              Owner Panel
            </p>

            <h1 className="mt-3 text-4xl font-black sm:text-5xl">
              Manage Plans
            </h1>

            <p className="mt-2 text-white/40">
              Add services and change prices shown on your website.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={loadPlans}
              className="flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
            >
              <RefreshCw size={15} />
              Refresh
            </button>

            <button
              onClick={() => {
                setShowAdd(!showAdd);
                setError("");
                setSuccess("");
              }}
              className="flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-white/80"
            >
              {showAdd ? (
                <X size={16} />
              ) : (
                <Plus size={16} />
              )}

              {showAdd ? "Close" : "Add Plan"}
            </button>
          </div>
        </div>

        {/* MESSAGES */}

        {error && (
          <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-300">
            <p className="font-semibold">
              Something went wrong
            </p>

            <p className="mt-1 text-sm opacity-70">
              {error}
            </p>
          </div>
        )}

        {success && (
          <div className="mt-8 rounded-2xl border border-green-500/20 bg-green-500/10 p-5 text-green-300">
            <div className="flex items-center gap-2">
              <Check size={17} />
              <p className="font-semibold">
                {success}
              </p>
            </div>
          </div>
        )}

        {/* ADD PLAN */}

        {showAdd && (
          <form
            onSubmit={createPlan}
            className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8"
          >
            <div className="mb-7">
              <p className="text-xs uppercase tracking-[0.25em] text-white/30">
                New Service
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                Add New Plan
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <input
                value={newName}
                onChange={(e) =>
                  setNewName(e.target.value)
                }
                placeholder="Plan name e.g. CAR DELIVERY"
                className="rounded-xl border border-white/10 bg-black px-4 py-3.5 outline-none placeholder:text-white/20 focus:border-white/30"
              />

              <input
                value={newPrice}
                onChange={(e) =>
                  setNewPrice(e.target.value)
                }
                type="number"
                min="0"
                placeholder="Price e.g. 3000"
                className="rounded-xl border border-white/10 bg-black px-4 py-3.5 outline-none placeholder:text-white/20 focus:border-white/30"
              />

              <textarea
                value={newDescription}
                onChange={(e) =>
                  setNewDescription(e.target.value)
                }
                rows={3}
                placeholder="Service description"
                className="resize-none rounded-xl border border-white/10 bg-black px-4 py-3.5 outline-none placeholder:text-white/20 focus:border-white/30 md:col-span-2"
              />

              <input
                value={newImageUrl}
                onChange={(e) =>
                  setNewImageUrl(e.target.value)
                }
                placeholder="Image URL (optional)"
                className="rounded-xl border border-white/10 bg-black px-4 py-3.5 outline-none placeholder:text-white/20 focus:border-white/30 md:col-span-2"
              />
            </div>

            <button
              disabled={saving}
              className="mt-6 rounded-full bg-white px-7 py-3.5 text-sm font-black text-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "CREATING..." : "CREATE PLAN"}
            </button>
          </form>
        )}

        {/* PLANS */}

        <section className="mt-10">
          {loading ? (
            <div className="flex min-h-[350px] items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03]">
              <div className="text-center">
                <RefreshCw
                  size={28}
                  className="mx-auto animate-spin text-white/30"
                />

                <p className="mt-4 text-sm text-white/40">
                  Loading plans...
                </p>
              </div>
            </div>
          ) : plans.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-16 text-center">
              <IndianRupee
                size={40}
                className="mx-auto text-white/20"
              />

              <h2 className="mt-5 text-xl font-bold">
                No plans found
              </h2>

              <p className="mt-2 text-sm text-white/30">
                Add your first service plan.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]"
                >
                  {/* IMAGE */}

                  {plan.imageUrl && (
                    <div className="h-48 overflow-hidden border-b border-white/10 bg-black">
                      <img
                        src={plan.imageUrl}
                        alt={plan.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-6 sm:p-7">
                    {editingId === plan.id ? (
                      <div className="space-y-4">
                        <div>
                          <label className="mb-2 block text-xs uppercase tracking-wider text-white/30">
                            Service Name
                          </label>

                          <input
                            value={editName}
                            onChange={(e) =>
                              setEditName(e.target.value)
                            }
                            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-white/30"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-xs uppercase tracking-wider text-white/30">
                            Price
                          </label>

                          <div className="relative">
                            <IndianRupee
                              size={17}
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                            />

                            <input
                              value={editPrice}
                              onChange={(e) =>
                                setEditPrice(
                                  e.target.value
                                )
                              }
                              type="number"
                              min="0"
                              className="w-full rounded-xl border border-white/10 bg-black py-3 pl-11 pr-4 outline-none focus:border-white/30"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="mb-2 block text-xs uppercase tracking-wider text-white/30">
                            Description
                          </label>

                          <textarea
                            value={editDescription}
                            onChange={(e) =>
                              setEditDescription(
                                e.target.value
                              )
                            }
                            rows={3}
                            className="w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-white/30"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-xs uppercase tracking-wider text-white/30">
                            Image URL
                          </label>

                          <input
                            value={editImageUrl}
                            onChange={(e) =>
                              setEditImageUrl(
                                e.target.value
                              )
                            }
                            placeholder="https://..."
                            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 outline-none focus:border-white/30"
                          />
                        </div>

                        <div className="flex gap-3 pt-2">
                          <button
                            type="button"
                            disabled={saving}
                            onClick={() =>
                              savePlan(plan.id)
                            }
                            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-black disabled:opacity-50"
                          >
                            <Check size={16} />
                            {saving
                              ? "SAVING..."
                              : "SAVE CHANGES"}
                          </button>

                          <button
                            type="button"
                            onClick={cancelEditing}
                            className="rounded-full border border-white/10 px-5 py-3 text-sm text-white/60 hover:bg-white/5 hover:text-white"
                          >
                            CANCEL
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between gap-5">
                          <div className="min-w-0">
                            <div className="flex items-center gap-3">
                              <h2 className="truncate text-2xl font-black">
                                {plan.name}
                              </h2>

                              <span
                                className={`shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${
                                  plan.isActive
                                    ? "border-green-500/20 bg-green-500/10 text-green-300"
                                    : "border-red-500/20 bg-red-500/10 text-red-300"
                                }`}
                              >
                                {plan.isActive
                                  ? "Active"
                                  : "Hidden"}
                              </span>
                            </div>

                            {plan.description && (
                              <p className="mt-3 text-sm leading-6 text-white/40">
                                {plan.description}
                              </p>
                            )}
                          </div>

                          <div className="shrink-0 text-right">
                            <p className="text-xs uppercase tracking-wider text-white/25">
                              Price
                            </p>

                            <p className="mt-1 text-2xl font-black">
                              ₹
                              {Number(
                                plan.price
                              ).toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>

                        <div className="mt-6 grid grid-cols-3 gap-2">
                          <button
                            onClick={() =>
                              startEditing(plan)
                            }
                            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-3 text-xs font-bold transition hover:border-white/30 hover:bg-white/5"
                          >
                            <Edit3 size={14} />
                            EDIT
                          </button>

                          <button
                            onClick={() =>
                              togglePlan(plan)
                            }
                            className="rounded-xl border border-white/10 px-3 py-3 text-xs font-bold transition hover:border-white/30 hover:bg-white/5"
                          >
                            {plan.isActive
                              ? "HIDE"
                              : "SHOW"}
                          </button>

                          <button
                            onClick={() =>
                              deletePlan(plan)
                            }
                            className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 px-3 py-3 text-xs font-bold text-red-300 transition hover:bg-red-500/10"
                          >
                            <Trash2 size={14} />
                            DELETE
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}