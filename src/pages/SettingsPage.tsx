import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useStore } from '../store';
import { Moon, Sun, Monitor, Mail, Lock, Phone, User as UserIcon, Palette, Cog, MessageSquare, Trash2, LogOut, Info, KeySquare, X, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Switch, Button, Input, Textarea, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Tooltip, Spinner } from '@nextui-org/react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import {
  IconUserCircle,
  IconLock,
  IconPhone,
  IconMail,
  IconSettings,
  IconBrush,
  IconMessageCircle,
  IconTrash,
  IconLogout,
  IconX,
  IconDeviceFloppy,
  IconCheck,
  IconAlertCircle,
  IconChevronRight,
  IconCog
} from '@tabler/icons-react';
import { isValidPhoneNumber } from 'libphonenumber-js';

// Define reusable styles
const inputStyles = {
  inputWrapper: [
    "h-12", "bg-gray-700", "border", "border-gray-600", "rounded-xl", "text-white",
    "group-data-[focus=true]:border-primary-500",
    "group-data-[focus=true]:ring-2",
    "group-data-[focus=true]:ring-primary-500/50",
    "transition-colors", "outline-none"
  ],
  input: "text-white relative z-0",
  label: "text-gray-300 font-medium"
};

const textAreaStyles = {
  inputWrapper: [
    "bg-gray-700", "border", "border-gray-600", "rounded-xl", "text-white",
    "group-data-[focus=true]:border-primary-500",
    "group-data-[focus=true]:ring-2",
    "group-data-[focus=true]:ring-primary-500/50",
    "transition-colors", "outline-none"
  ],
  input: "text-white relative z-0",
  label: "text-gray-300 font-medium"
};

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "danger",
}) => {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      backdrop="blur"
      placement="center"
      size="md"
      classNames={{
        base: "bg-gray-800 border border-gray-700 rounded-2xl",
        header: "border-b border-gray-700",
        footer: "border-t border-gray-700",
        closeButton: "hover:bg-gray-600 active:bg-gray-500 text-white",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-white text-lg font-semibold">{title}</ModalHeader>
        <ModalBody>
          <p className="text-gray-300 text-center text-base py-4">{message}</p>
        </ModalBody>
        <ModalFooter className="flex justify-center gap-4">
          <Button 
            variant="flat" 
            onPress={onClose} 
            className="bg-white text-pink-600 font-semibold hover:bg-gray-100 active:bg-gray-200 border border-pink-300"
          >
            {cancelText}
          </Button>
          <Button color={confirmColor} onPress={onConfirm} className="font-semibold text-white">
            {confirmText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// Type for active section state
type SettingsSection = 'appearance' | 'account' | 'personalisation';

const SettingsPage = () => {
  const { settings, updateSettings, clearAllData, user, setUser } = useStore();
  const navigate = useNavigate();
  const [isConfirmClearDataOpen, setIsConfirmClearDataOpen] = useState(false);
  const [isConfirmLogoutOpen, setIsConfirmLogoutOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SettingsSection>('appearance');

  // Account State
  const [newEmail, setNewEmail] = useState(user?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [loadingAccount, setLoadingAccount] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);
  const [accountSuccess, setAccountSuccess] = useState<string | null>(null);
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(false);
  const [isSavingPhone, setIsSavingPhone] = useState(false);
  const [phoneBeingVerified, setPhoneBeingVerified] = useState<string | null>(null);

  // CAPTCHA State
  const [isCaptchaModalOpen, setIsCaptchaModalOpen] = useState(false);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha>(null);

  // Personalisation state (spelling corrected)
  const [nickname, setNickname] = useState('');
  const [userRole, setUserRole] = useState('');
  const [botTraits, setBotTraits] = useState('');
  const [otherInfo, setOtherInfo] = useState('');
  const [loadingPersonalisation, setLoadingPersonalisation] = useState(false);
  const [personalisationSuccess, setPersonalisationSuccess] = useState<string | null>(null);
  const [personalisationError, setPersonalisationError] = useState<string | null>(null);
  const [enableMemory, setEnableMemory] = useState(settings.memoryEnabled);

  // Confirmation Modal State
  const { isOpen: isLogoutModalOpen, onOpen: onLogoutModalOpen, onClose: onLogoutModalClose } = useDisclosure();
  const { isOpen: isClearDataModalOpen, onOpen: onClearDataModalOpen, onClose: onClearDataModalClose } = useDisclosure();

  // Fetch profile data or load from localStorage
  useEffect(() => {
    const fetchProfileOrLoadLocal = async () => {
      if (user && !user.is_anonymous) {
        setNewEmail(user.email ?? '');
        setNewPhoneNumber(user.phone ?? '');
        
        setLoadingPersonalisation(true);
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('nickname, user_role, bot_traits, additional_info, enable_memory')
            .eq('id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            throw error;
          } else if (data) {
            setNickname(data.nickname || '');
            setUserRole(data.user_role || '');
            setBotTraits(data.bot_traits || '');
            setOtherInfo(data.additional_info || '');
            setEnableMemory(data.enable_memory ?? true);
          }
        } catch (err: any) {
          console.error('Error fetching profile data:', err);
          toast.error(`Could not load profile data: ${err.message}`);
        } finally {
          setLoadingPersonalisation(false);
        }
      } else {
        setLoadingPersonalisation(true);
        try {
          const localData = localStorage.getItem('anonymousPersonalisation');
          if (localData) {
            const parsedData = JSON.parse(localData);
            setNickname(parsedData.nickname || '');
            setUserRole(parsedData.user_role || '');
            setBotTraits(parsedData.bot_traits || '');
            setOtherInfo(parsedData.additional_info || '');
            setEnableMemory(parsedData.enable_memory ?? true);
          } else {
            setEnableMemory(settings.memoryEnabled);
          }
        } catch (err) {
          console.error('Error loading local personalisation:', err);
        } finally {
          setLoadingPersonalisation(false);
        }
      }
    };

    fetchProfileOrLoadLocal();
  }, [user]);

  useEffect(() => {
    if (user?.phone) {
      setIsPhoneNumberValid(isValidPhoneNumber(user.phone));
    } else {
      setIsPhoneNumberValid(false);
    }
  }, [user]);

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    updateSettings({ theme });
  };

  const handleMemoryToggle = () => {
    updateSettings({ memoryEnabled: !settings.memoryEnabled });
  };

  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const number = e.target.value;
    setNewPhoneNumber(number);
    if (number && isValidPhoneNumber(number)) {
      setIsPhoneNumberValid(true);
      setAccountError(null);
    } else {
      setIsPhoneNumberValid(false);
    }
  };

  const handleVerifyAndSavePhone = () => {
    if (!isPhoneNumberValid || !newPhoneNumber || newPhoneNumber === user?.phone) {
      setAccountError("Please enter a valid, new phone number to verify.");
      return;
    }
    console.log("Opening CAPTCHA for phone number:", newPhoneNumber);
    setPhoneBeingVerified(newPhoneNumber);
    setIsCaptchaModalOpen(true);
    setAccountError(null);
    setAccountSuccess(null);
    setCaptchaError(null);
  };

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.is_anonymous) return;

    setLoadingAccount(true);
    setAccountError(null);
    setAccountSuccess(null);

    try {
      const updates: { email?: string; password?: string; } = {};
      let emailChanged = false;

      if (newEmail && newEmail !== user.email) {
        updates.email = newEmail;
        emailChanged = true;
      }
      if (newPassword) {
        updates.password = newPassword;
      }
      
      if (Object.keys(updates).length === 0) {
        setAccountSuccess("No Email/Password changes detected.");
        setLoadingAccount(false);
        return;
      }

      await performUpdateUser(updates);

    } catch (error: any) {
      console.error("Email/Password update error:", error);
      setAccountError(error.message || "Failed to update email/password.");
      setAccountSuccess(null);
      setLoadingAccount(false);
    }
  };

  const handleCaptchaVerified = async (token: string | null) => {
    if (!token) {
      setCaptchaError('CAPTCHA verification failed. Please try again.');
      captchaRef.current?.resetCaptcha();
      return;
    }

    console.log("CAPTCHA verified, proceeding with phone update for:", phoneBeingVerified);
    setCaptchaError(null);

    if (!phoneBeingVerified) {
      console.error("Phone number to verify is missing after CAPTCHA.");
      setCaptchaError("Phone number details missing. Please close and try saving again.");
      setIsCaptchaModalOpen(false);
      captchaRef.current?.resetCaptcha();
      setPhoneBeingVerified(null);
      return;
    }

    const updates = { phone: phoneBeingVerified };

    setIsSavingPhone(true);
    await performUpdateUser(updates, token);
    setIsSavingPhone(false);

    setIsCaptchaModalOpen(false);
    captchaRef.current?.resetCaptcha();
    setPhoneBeingVerified(null);
  };

  const performUpdateUser = async (updates: { email?: string; password?: string; phone?: string | null }, captchaToken?: string) => {
    const isPhoneUpdate = 'phone' in updates && (!('email' in updates) && !('password' in updates));
    const currentLoaderSetter = isPhoneUpdate ? setIsSavingPhone : setLoadingAccount;
    currentLoaderSetter(true);
    setAccountError(null);
    setAccountSuccess(null);

    try {
      console.log("Performing Supabase update with:", updates, "Captcha:", captchaToken ? 'Yes' : 'No');
      const options: { captchaToken?: string } = captchaToken ? { captchaToken } : {};

      const finalUpdates = { ...updates };
      if (finalUpdates.phone === '') {
        finalUpdates.phone = null;
      }

      const { data, error } = await supabase.auth.updateUser(
        finalUpdates,
        captchaToken ? options : undefined
      );

      if (error) {
        console.error('Supabase Update error:', error);
        if (error.message && (error.message.toLowerCase().includes('captcha') || error.message.toLowerCase().includes('verification failed'))) {
          throw new Error('CAPTCHA verification failed on server. Please try again.');
        }
        throw new Error(error.message || 'Failed to update account.');
      }

      console.log("Supabase update successful:", data.user);
      if (data.user) {
        setUser(data.user);
        let successMsg = '';
        let emailUpdated = false;
        let passwordUpdated = false;
        let phoneUpdated = false;

        if ('email' in finalUpdates && finalUpdates.email !== undefined) {
           setNewEmail(data.user.email ?? '');
           successMsg = 'Email updated. Check your new email for verification.';
           emailUpdated = true;
        }
        if ('phone' in finalUpdates) {
           const savedPhone = data.user.phone ?? null;
           setNewPhoneNumber(savedPhone ?? '');
           setIsPhoneNumberValid(savedPhone ? isValidPhoneNumber(savedPhone) : false);
           successMsg = 'Phone number updated successfully.';
           phoneUpdated = true;
        }
        if ('password' in finalUpdates && finalUpdates.password) {
           setNewPassword('');
           successMsg = 'Password updated successfully.';
           passwordUpdated = true;
        }

        if (phoneUpdated && !emailUpdated && !passwordUpdated) {
          successMsg = 'Phone number updated successfully.';
        } else if (emailUpdated && !phoneUpdated && !passwordUpdated) {
          successMsg = 'Email updated. Check your new email for verification.';
        } else if (passwordUpdated && !phoneUpdated && !emailUpdated) {
            successMsg = 'Password updated successfully.';
        } else if (phoneUpdated || emailUpdated || passwordUpdated) {
            successMsg = 'Account details updated successfully.';
        } else if (!successMsg) {
            successMsg = 'Account details saved.';
        }

        setAccountSuccess(successMsg);
        toast.success(successMsg);
      } else {
        console.warn("Supabase update successful but no user data returned.");
        setAccountSuccess("Update process completed, but user data refresh failed.");
      }

    } catch (error: any) {
      console.error("Error in performUpdateUser:", error);
      const errorMsg = error.message || 'An unexpected error occurred.';
      setAccountError(errorMsg);
      if (isPhoneUpdate) {
        setCaptchaError(errorMsg);
      }
      toast.error(errorMsg);
    } finally {
      currentLoaderSetter(false);
    }
  };

  const handleLogout = async () => {
    console.log("Logging out...");
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('anonymousPersonalisation');
    updateSettings({ memoryEnabled: true });
    navigate('/auth');
    toast.success('Logged out successfully.');
    onLogoutModalClose();
  };

  const handleSavePersonalisation = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoadingPersonalisation(true);
    setPersonalisationError(null);
    setPersonalisationSuccess(null);

    if (user && !user.is_anonymous) {
      // --- Logged-in User: Save to Supabase ---
      const updates = {
        id: user.id, 
        nickname,
        user_role: userRole,
        bot_traits: botTraits,
        additional_info: otherInfo,
        enable_memory: enableMemory,
        updated_at: new Date().toISOString(),
      };

      try {
        const { error } = await supabase
          .from('profiles') 
          .upsert(updates, { onConflict: 'id' }); 

        if (error) {
          throw error;
        }
        toast.success('Personalisation saved successfully!');
      } catch (error: any) {
        console.error('Error saving personalisation to DB:', error);
        toast.error(`Failed to save personalisation: ${error.message}`);
        setPersonalisationError(`Failed to save: ${error.message}`);
      } finally {
        setLoadingPersonalisation(false);
      }
    } else {
      // --- Anonymous or Logged-out User: Save to localStorage ---
      const localData = {
         nickname,
         user_role: userRole,
         bot_traits: botTraits,
         additional_info: otherInfo,
         enable_memory: enableMemory,
       };
       try {
         localStorage.setItem('anonymousPersonalisation', JSON.stringify(localData));
         toast.success('Personalisation saved locally.');
         setPersonalisationSuccess('Settings saved locally.');
       } catch (error) {
          console.error('Error saving personalisation locally:', error);
          toast.error('Could not save personalisation locally.');
          setPersonalisationError('Could not save settings locally.');
       } finally {
          setLoadingPersonalisation(false);
       }
    }
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'appearance':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Appearance</h2>
            <div className="flex gap-4">
              <button
                onClick={() => handleThemeChange('light')}
                className={`flex-1 p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-colors ${
                  settings.theme === 'light' 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-500' 
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Sun className="h-6 w-6" /> <span>Light</span>
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`flex-1 p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-colors ${
                  settings.theme === 'dark' 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-500' 
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Moon className="h-6 w-6" /> <span>Dark</span>
              </button>
              <button
                onClick={() => handleThemeChange('system')}
                className={`flex-1 p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-colors ${
                  settings.theme === 'system' 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-500' 
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Monitor className="h-6 w-6" /> <span>System</span>
              </button>
            </div>
          </div>
        );
      case 'account':
        if (!user || user.is_anonymous) {
          return (
            <div className="text-center text-gray-400 space-y-4 py-8">
              <UserIcon className="h-12 w-12 mx-auto text-gray-500" />
              <p>You need to be signed in to manage your account.</p>
              <Link 
                to="/auth"
                className="inline-block px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
              >
                Sign In / Sign Up
              </Link>
            </div>
          );
        }

        return (
          <div>
            <h3 className="text-xl font-semibold text-white mb-6">Account Settings</h3>
            {accountSuccess && <p className="text-sm text-green-400 text-center mb-4">{accountSuccess}</p>}
            {accountError && <p className="text-sm text-red-400 text-center mb-4">{accountError}</p>}

            <form onSubmit={handleUpdateAccount} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                  <Input
                    isReadOnly
                    id="email"
                    type="email"
                    value={newEmail}
                    classNames={{
                      inputWrapper: [
                        "h-12", "pl-10", "bg-gray-700", "border", "border-gray-600", "rounded-xl", "text-white",
                        "group-data-[focus=true]:border-[rgb(255,0,122)]",
                        "group-data-[focus=true]:ring-2",
                        "group-data-[focus=true]:ring-[rgb(255,0,122)]/50",
                        "transition-colors", "outline-none"
                      ],
                      input: "text-white relative z-0 \
                              [&:-webkit-autofill]:bg-transparent \
                              [&:-webkit-autofill]:text-white \
                              [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgb(55,65,81)] \
                              dark:[&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgb(55,65,81)]"
                    }}
                    placeholder="Enter your email"
                    required
                    aria-label="Email address"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Email changes require verification via link sent to the new address.</p>
              </div>

              <div className="space-y-3">
                 <div className="flex items-center justify-between">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                        Phone Number (Optional)
                    </label>
                    <Tooltip
                        content={user?.phone ? `Current number: ${user.phone}` : "No phone number saved"}
                        placement="top"
                        delay={0}
                        closeDelay={0}
                        className="bg-gray-900 text-white text-xs px-2 py-1 rounded border border-gray-700"
                    >
                        <Info size={16} className="text-gray-400 cursor-pointer" />
                    </Tooltip>
                 </div>
                  <div className="flex items-start gap-3">
                     <div className="relative flex-grow">
                       <Input
                         id="phone"
                         type="tel"
                         variant="bordered"
                         placeholder="Enter phone number (e.g., +44...)"
                         value={newPhoneNumber || ''} 
                         onChange={handlePhoneInputChange}
                         startContent={<IconPhone size={18} className="text-gray-400" />}
                         classNames={{
                            inputWrapper: [
                              "h-12",
                              "pl-10",
                              "bg-gray-700",
                              "border", 
                              "border-gray-600",
                              "rounded-xl",
                              "text-white",
                              "group-data-[focus=true]:border-[rgb(255,0,122)]",
                              "group-data-[focus=true]:ring-2",
                              "group-data-[focus=true]:ring-[rgb(255,0,122)]/50",
                              "transition-colors", 
                              "outline-none"
                            ],
                            input: "text-white pl-10 relative z-0 \
                                    [&:-webkit-autofill]:bg-transparent \
                                    [&:-webkit-autofill]:text-white \
                                    [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgb(55,65,81)] \
                                    dark:[&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgb(55,65,81)]"
                          }}
                         aria-label="Phone Number"
                         disabled={isSavingPhone || loadingAccount} 
                       />
                     </div>
                     {newPhoneNumber && newPhoneNumber !== user?.phone && (
                         <Button
                           type="button"
                           color="secondary"
                           variant="solid"
                           onClick={handleVerifyAndSavePhone}
                           isLoading={isSavingPhone}
                           disabled={!isPhoneNumberValid || isSavingPhone || loadingAccount}
                           className="font-semibold h-12 shrink-0"
                           style={{ backgroundColor: (!isPhoneNumberValid || isSavingPhone || loadingAccount) ? '#a1a1aa' : '#f43f5e' }}
                         >
                           {isSavingPhone ? 'Saving...' : 'Verify & Save Number'}
                         </Button>
                     )}
                 </div>
                 {!isPhoneNumberValid && newPhoneNumber && 
                     <p className="text-xs text-red-400 mt-1">Please enter a valid number with country code.</p>
                 }
                 {user?.phone && user.phone === newPhoneNumber && 
                    <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                        <IconCheck size={14} /> Phone number saved
                    </p>
                 }
              </div>

              <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">New Password (Optional)</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                    <Input
                      id="password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      classNames={{
                        inputWrapper: [
                          "h-12", "pl-10", "bg-gray-700", "border", "border-gray-600", "rounded-xl", "text-white",
                          "group-data-[focus=true]:border-[rgb(255,0,122)]",
                          "group-data-[focus=true]:ring-2",
                          "group-data-[focus=true]:ring-[rgb(255,0,122)]/50",
                          "transition-colors", "outline-none"
                        ],
                        input: "text-white relative z-0 \
                                [&:-webkit-autofill]:bg-transparent \
                                [&:-webkit-autofill]:text-white \
                                [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgb(55,65,81)] \
                                dark:[&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgb(55,65,81)]"
                      }}
                      placeholder="Enter new password to change"
                      aria-label="New Password"
                      disabled={loadingAccount}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Leave blank to keep current password.</p>
              </div>

               <Button
                  type="submit"
                  className="w-full h-12 bg-[rgb(255,0,122)] hover:bg-[rgb(220,0,105)] text-white shadow-lg shadow-[rgb(255,0,122)]/50 rounded-xl font-semibold py-2.5"
                  isLoading={loadingAccount && !isCaptchaModalOpen}
                  disabled={loadingAccount}
               >
                  {loadingAccount ? 'Saving Email/Password...' : 'Save Email/Password Changes'}
               </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-700 space-y-4">
              <Button
                fullWidth
                variant="bordered"
                className="border-gray-600 text-gray-300 hover:bg-gray-700/50 h-11"
                startContent={<IconLogout size={18} />}
                onPress={onLogoutModalOpen}
              >
                Log Out
              </Button>
              <Button
                fullWidth
                color="danger"
                variant="bordered"
                className="border-danger/50 text-danger hover:bg-danger/10 h-11"
                startContent={<IconTrash size={18} className="text-danger" />}
                onPress={onClearDataModalOpen}
              >
                Clear All Data
              </Button>
            </div>
          </div>
        );
      case 'personalisation':
        return (
          <form onSubmit={handleSavePersonalisation} className="space-y-5">
            <Switch
              isSelected={enableMemory}
              onValueChange={setEnableMemory}
              size="sm"
            >
              <div className="flex items-center gap-2">
                Enable Conversation Memory
                <Tooltip
                    content="Allow the bot to remember previous messages in this session."
                    placement="top"
                    delay={0}
                    closeDelay={0}
                    className="bg-gray-900 text-white text-xs px-2 py-1 rounded border border-gray-700"
                 >
                     <Info size={16} className="text-gray-400 cursor-help" />
                 </Tooltip>
              </div>
            </Switch>

            {/* Input fields */}
            <div>
              <Input
                label="What should UniMind call you?"
                value={nickname}
                onValueChange={setNickname}
                placeholder="Your nickname (optional)"
                labelPlacement="outside"
                classNames={inputStyles}
              />
            </div>
             <div>
              <Textarea
                label="What do you do?"
                value={userRole}
                onValueChange={setUserRole}
                placeholder="E.g., Software Engineer, Student, Artist... (optional)"
                labelPlacement="outside"
                classNames={textAreaStyles}
                minRows={1}
              />
            </div>
             <div>
              <Textarea
                label="What traits should UniMind have?"
                value={botTraits}
                onValueChange={setBotTraits}
                placeholder="E.g., Friendly, Formal, Sarcastic, Concise... (optional)"
                labelPlacement="outside"
                classNames={textAreaStyles}
                 minRows={2}
              />
            </div>
             <div>
              <Textarea
                label="Anything else UniMind should know?"
                value={otherInfo}
                onValueChange={setOtherInfo}
                placeholder="E.g., Specific interests, topics to avoid, preferred language style... (optional)"
                labelPlacement="outside"
                classNames={textAreaStyles}
                minRows={3}
              />
            </div>

            {/* Save Button and Messages */}
            <div className="flex flex-col items-center gap-2 pt-2">
                <Button
                    type="submit"
                    color="secondary" // Use pink color
                    className="font-semibold w-full h-11"
                    isLoading={loadingPersonalisation} // <-- Add isLoading prop
                >
                    {loadingPersonalisation ? 'Saving...' : 'Save Personalisation'} {/* Change text when loading */}
                </Button>
                {/* Display Success/Error messages */} 
                {personalisationSuccess && (
                    <p className="text-sm text-green-500 mt-2 text-center">{personalisationSuccess}</p>
                )}
                {personalisationError && (
                    <p className="text-sm text-red-500 mt-2 text-center">{personalisationError}</p>
                )}
            </div>
          </form>
        );
      default:
        return null;
    }
  };

  const getMenuItemClass = (section: SettingsSection) => {
    const baseClass = "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-left";
    const activeClass = "bg-gray-700 text-primary-400 font-semibold";
    const inactiveClass = "text-gray-300 hover:bg-gray-700/50 hover:text-white";
    return `${baseClass} ${activeSection === section ? activeClass : inactiveClass}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-white">Settings</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 flex-shrink-0">
          <nav className="space-y-2">
            <button onClick={() => setActiveSection('appearance')} className={getMenuItemClass('appearance')}>
              <Palette size={20} /> Appearance
            </button>
            <button onClick={() => setActiveSection('account')} className={getMenuItemClass('account')}>
               <UserIcon size={20} /> Account
            </button>
            <button onClick={() => setActiveSection('personalisation')} className={getMenuItemClass('personalisation')}>
              <Cog size={20} /> Personalisation
            </button>
          </nav>
        </aside>

        <main className={`flex-1 bg-gray-800 rounded-lg p-6 border border-gray-700 min-h-[300px] overflow-y-auto transition-shadow duration-300 ${activeSection === 'personalisation' ? 'shadow-lg shadow-pink-500/30' : 'shadow-sm'}`}>
          {renderSectionContent()}
        </main>
      </div>

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={onLogoutModalClose}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        confirmColor="secondary"
        confirmText="Log Out"
      />
      <ConfirmModal
        isOpen={isClearDataModalOpen}
        onClose={onClearDataModalClose}
        onConfirm={() => {
            clearAllData();
            onClearDataModalClose();
            toast.success("All data cleared successfully.");
        }}
        title="Confirm Clear Data"
        message="Are you sure you want to clear all chat data? This cannot be undone."
        confirmColor="danger"
        confirmText="Clear Data"
      />

      {isCaptchaModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-700 shadow-primary-500/40 relative w-full max-w-sm">
            <button
              onClick={() => {
                setIsCaptchaModalOpen(false);
                setCaptchaError(null);
                setPhoneBeingVerified(null);
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-300 transition-colors disabled:opacity-50"
              aria-label="Close verification modal"
              disabled={isSavingPhone}
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold text-white mb-4 text-center">Verify Phone Number</h2>
            <p className="text-gray-400 text-sm mb-6 text-center">
              Please complete the challenge below to verify your number: <br/><strong>{phoneBeingVerified}</strong>
            </p>

            <div className="flex justify-center mb-4">
              <HCaptcha
                ref={captchaRef}
                key={phoneBeingVerified || 'captcha-modal'}
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || ''}
                onVerify={handleCaptchaVerified}
                onError={(err) => {
                  console.error("hCaptcha error:", err);
                  setCaptchaError(`CAPTCHA error: ${err}. Please try again or close the modal.`);
                }}
                onExpire={() => {
                  console.log("hCaptcha expired");
                  setCaptchaError('CAPTCHA challenge expired. Please try again or close the modal.');
                }}
              />
            </div>
            {isSavingPhone && (
               <div className="flex justify-center items-center mb-4">
                   <Spinner size="sm" color="secondary" />
                   <span className="ml-2 text-sm text-gray-400">Verifying and saving...</span>
               </div>
            )}
            {captchaError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-xs text-center">{captchaError}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;