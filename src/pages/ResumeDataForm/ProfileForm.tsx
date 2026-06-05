import React, { useState } from 'react';
import Input from '../../Components/Forms/Input';

interface ProfileFormInterface{
  slug: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  linkedin: string;
  profile_text: string;
}

const initialForm: ProfileFormInterface = {
  slug: "",
  name: "",
  title: "",
  email: "",
  phone: "",
  address: "",
  website: "",
  linkedin: "",
  profile_text: "",
}

const ProfileForm: React.FC = () => {
  const [form, setForm] = useState<ProfileFormInterface>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev)=> ({
      ...prev, [name]: value
    }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!form.slug || !form.name || !form.email) {
      setError("Please fill in slug, name, and email.");
      return;
    }
    setLoading(true);

    setSuccess("Resume data saving is disabled because Supabase was removed.");
    setForm(initialForm);
    setLoading(false);
  }
  return (
    <>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-6">Add Profile Data</h1>
        {success && <span className="text-green-600">{success}</span>}
        <form onSubmit={handleSubmit} className="space-y-2">
          {Object.keys(initialForm).map((key) => (
            <Input
              key={key}
              label={key.replace("_", " ").toUpperCase()}
              name={key as keyof ProfileFormInterface}
              value={form[key as keyof ProfileFormInterface]}
              onChange={handleChange}
            />
          ))}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl px-4 py-2 border shadow-sm disabled:opacity-60"
            >
            {loading ? "Saving..." : "Save"}
          </button>
            {error && <span className="text-red-600">{error}</span>}
          </div>
        </form>
      </div>
    </>
  );
};

export default ProfileForm;
