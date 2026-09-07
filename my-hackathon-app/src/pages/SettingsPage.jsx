import { useState, useEffect } from 'react';
import { Settings, User, Book, Bell, AlertTriangle, Save, Check, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SettingsPage() {
  const { user, userProfile, updateProfileData, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(() => ({
    fullName: userProfile?.fullName || userProfile?.name || user?.displayName || 'Student',
    email: userProfile?.email || user?.email || '',
    university: userProfile?.university || '',
    program: userProfile?.program || 'Undergraduate',
    semester: userProfile?.semester || '1st Semester',
    avatarUrl: userProfile?.avatarUrl || user?.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=Student&backgroundColor=6347f5`,
  }));

  const [studyPrefs, setStudyPrefs] = useState(() => ({
    dailyStudyTime: userProfile?.studyPreferences?.dailyStudyTime || '2 hours',
    preferredTime: userProfile?.studyPreferences?.preferredTime || 'Evening (6–10 PM)',
    studyGoal: userProfile?.studyPreferences?.studyGoal || 'Score above 80% in finals',
  }));

  const [notifications, setNotifications] = useState(() => ({
    studyReminders: userProfile?.notifications?.studyReminders ?? true,
    quizRecommendations: userProfile?.notifications?.quizRecommendations ?? true,
    planUpdates: userProfile?.notifications?.planUpdates ?? false,
  }));

  useEffect(() => {
    if (userProfile) {
      setProfile((prev) => ({
        ...prev,
        fullName: userProfile.fullName || userProfile.name || prev.fullName,
        email: userProfile.email || prev.email,
        university: userProfile.university || prev.university,
        program: userProfile.program || prev.program,
        semester: userProfile.semester || prev.semester,
        avatarUrl: userProfile.avatarUrl || prev.avatarUrl,
      }));
      if (userProfile.studyPreferences) {
        setStudyPrefs((prev) => ({
          ...prev,
          dailyStudyTime: userProfile.studyPreferences.dailyStudyTime || prev.dailyStudyTime,
          preferredTime: userProfile.studyPreferences.preferredTime || prev.preferredTime,
          studyGoal: userProfile.studyPreferences.studyGoal || prev.studyGoal,
        }));
      }
      if (userProfile.notifications) {
        setNotifications((prev) => ({
          ...prev,
          studyReminders: userProfile.notifications.studyReminders ?? prev.studyReminders,
          quizRecommendations: userProfile.notifications.quizRecommendations ?? prev.quizRecommendations,
          planUpdates: userProfile.notifications.planUpdates ?? prev.planUpdates,
        }));
      }
    }
  }, [userProfile]);

  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfileData({
        ...profile,
        studyPreferences: studyPrefs,
        notifications: notifications,
      });
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleProfileChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });
  const handleStudyPrefsChange = (e) => setStudyPrefs({ ...studyPrefs, [e.target.name]: e.target.value });
  const toggleNotification = (key) => setNotifications({ ...notifications, [key]: !notifications[key] });

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 relative">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-[#7458F7] to-[#5F45E7] flex items-center justify-center text-white shadow-sm">
          <Settings className="w-4.5 h-4.5" />
        </div>
        <h1 className="text-[24px] font-[650] text-[#202033] tracking-[-0.035em] leading-[1.15]">Profile & Settings</h1>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <section className="card p-6">
          <div className="flex items-center gap-2 mb-6 border-b border-[#ECECF2] pb-4">
            <User className="w-4.5 h-4.5 text-[#6347F5]" />
            <h2 className="text-[15px] font-[700] text-[#202033] tracking-[-0.015em]">Personal Information</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-8 mb-2">
            <div className="shrink-0 flex flex-col items-center">
              <img src={profile.avatarUrl || mockUser.avatarUrl} alt="Profile" className="w-20 h-20 rounded-full border-4 border-[#F0ECFF] mb-3 object-cover shadow-xs" />
              <button
                type="button"
                onClick={() => {
                  const newSeed = Math.random().toString(36).substring(7);
                  setProfile(prev => ({ ...prev, avatarUrl: `https://i.pravatar.cc/150?u=${newSeed}` }));
                }}
                className="text-[12px] text-[#6347F5] font-[650] hover:underline cursor-pointer"
              >
                Change Avatar
              </button>
            </div>
            
            <div className="grow grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-[600] text-[#6F7182] mb-1">Full Name</label>
                <input type="text" name="fullName" value={profile.fullName} onChange={handleProfileChange} className="w-full px-3 py-2 border border-[#ECECF2] rounded-[8px] text-[12px] focus:outline-none focus:border-[#6347F5] bg-[#FCFCFE] text-[#202033]" />
              </div>
              <div>
                <label className="block text-[12px] font-[600] text-[#6F7182] mb-1">Email</label>
                <input type="email" name="email" value={profile.email} onChange={handleProfileChange} className="w-full px-3 py-2 border border-[#ECECF2] rounded-[8px] text-[12px] focus:outline-none focus:border-[#6347F5] bg-[#FCFCFE] text-[#202033]" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[12px] font-[600] text-[#6F7182] mb-1">University</label>
                <input type="text" name="university" value={profile.university} onChange={handleProfileChange} className="w-full px-3 py-2 border border-[#ECECF2] rounded-[8px] text-[12px] focus:outline-none focus:border-[#6347F5] bg-[#FCFCFE] text-[#202033]" />
              </div>
              <div>
                <label className="block text-[12px] font-[600] text-[#6F7182] mb-1">Program</label>
                <input type="text" name="program" value={profile.program} onChange={handleProfileChange} className="w-full px-3 py-2 border border-[#ECECF2] rounded-[8px] text-[12px] focus:outline-none focus:border-[#6347F5] bg-[#FCFCFE] text-[#202033]" />
              </div>
              <div>
                <label className="block text-[12px] font-[600] text-[#6F7182] mb-1">Semester</label>
                <input type="text" name="semester" value={profile.semester} onChange={handleProfileChange} className="w-full px-3 py-2 border border-[#ECECF2] rounded-[8px] text-[12px] focus:outline-none focus:border-[#6347F5] bg-[#FCFCFE] text-[#202033]" />
              </div>
            </div>
          </div>
        </section>

        {/* Study Preferences */}
        <section className="card p-6">
          <div className="flex items-center gap-2 mb-6 border-b border-[#ECECF2] pb-4">
            <Book className="w-4.5 h-4.5 text-[#6347F5]" />
            <h2 className="text-[15px] font-[700] text-[#202033] tracking-[-0.015em]">Study Preferences</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-[600] text-[#6F7182] mb-1">Daily Study Time</label>
              <select name="dailyStudyTime" value={studyPrefs.dailyStudyTime} onChange={handleStudyPrefsChange} className="w-full px-3 py-2 border border-[#ECECF2] rounded-[8px] text-[12px] focus:outline-none focus:border-[#6347F5] bg-[#FCFCFE] text-[#202033]">
                <option value="1-2 hours">1-2 hours</option>
                <option value="2-4 hours">2-4 hours</option>
                <option value="4 hours">4 hours</option>
                <option value="4-6 hours">4-6 hours</option>
                <option value="6+ hours">6+ hours</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-[600] text-[#6F7182] mb-1">Preferred Time</label>
              <select name="preferredTime" value={studyPrefs.preferredTime} onChange={handleStudyPrefsChange} className="w-full px-3 py-2 border border-[#ECECF2] rounded-[8px] text-[12px] focus:outline-none focus:border-[#6347F5] bg-[#FCFCFE] text-[#202033]">
                <option value="Morning (8–12 AM)">Morning (8–12 AM)</option>
                <option value="Afternoon (1–5 PM)">Afternoon (1–5 PM)</option>
                <option value="Evening (6–10 PM)">Evening (6–10 PM)</option>
                <option value="Night (10 PM–2 AM)">Night (10 PM–2 AM)</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-[12px] font-[600] text-[#6F7182] mb-1">Primary Study Goal</label>
              <input type="text" name="studyGoal" value={studyPrefs.studyGoal} onChange={handleStudyPrefsChange} className="w-full px-3 py-2 border border-[#ECECF2] rounded-[8px] text-[12px] focus:outline-none focus:border-[#6347F5] bg-[#FCFCFE] text-[#202033]" />
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="card p-6">
          <div className="flex items-center gap-2 mb-6 border-b border-[#ECECF2] pb-4">
            <Bell className="w-4.5 h-4.5 text-[#6347F5]" />
            <h2 className="text-[15px] font-[700] text-[#202033] tracking-[-0.015em]">Notifications</h2>
          </div>
          
          <div className="space-y-4">
            <ToggleSwitch 
              label="Study Reminders" 
              description="Get notified when it's time for a scheduled study session"
              checked={notifications.studyReminders} 
              onChange={() => toggleNotification('studyReminders')} 
            />
            <ToggleSwitch 
              label="Quiz Recommendations" 
              description="Receive alerts when the AI suggests a practice quiz"
              checked={notifications.quizRecommendations} 
              onChange={() => toggleNotification('quizRecommendations')} 
            />
            <ToggleSwitch 
              label="Plan Updates" 
              description="Notify me when the AI adjusts my study plan automatically"
              checked={notifications.planUpdates} 
              onChange={() => toggleNotification('planUpdates')} 
            />
          </div>
        </section>

        {/* Danger Zone */}
        <section className="card p-6 border-red-200">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4.5 h-4.5 text-[#EF4444]" />
            <h2 className="text-[15px] font-[700] text-[#EF4444]">Danger Zone</h2>
          </div>
          <p className="text-[12px] text-[#6F7182] mb-4">Manage your account session or permanently remove your data.</p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#ECECF2] hover:bg-[#FEE2E2] hover:text-[#EF4444] text-[#202033] rounded-[8px] text-[12px] font-[650] cursor-pointer transition-colors"
            >
              <LogOut className="w-4 h-4 text-[#EF4444]" />
              Sign Out
            </button>
            <button disabled className="px-4 py-2 bg-white border border-red-200 text-[#EF4444] rounded-[8px] text-[12px] font-[600] opacity-50 cursor-not-allowed">
              Delete Account
            </button>
          </div>
        </section>

        {/* Save Actions */}
        <div className="flex justify-end pt-2 pb-8">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#6347F5] hover:bg-[#5236E5] text-white rounded-[8px] text-[12.5px] font-[700] transition-colors disabled:opacity-70 cursor-pointer shadow-sm"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Changes
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 bg-[#18A86B] text-white px-4 py-3 rounded-[8px] shadow-lg text-[13px] font-[600] animate-in slide-in-from-bottom-5">
          <Check className="w-4.5 h-4.5" />
          <span>Settings saved successfully!</span>
        </div>
      )}
    </div>
  );
}

function ToggleSwitch({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-1">
      <div>
        <h3 className="text-[13.5px] font-[650] text-[#202033]">{label}</h3>
        <p className="text-[12px] text-[#6F7182]">{description}</p>
      </div>
      <button 
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${checked ? 'bg-[#6347F5]' : 'bg-[#EEEEF4]'}`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-xs ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );
}