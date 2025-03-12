import { useState, useEffect } from 'react';

type PasswordStrengthMeterProps = {
  password: string;
};

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    calculatePasswordStrength(password);
  }, [password]);

  const calculatePasswordStrength = (password: string) => {
    if (password.length < 6) {return setPasswordStrength(0)};
    let strength = 0;
    if (password.length > 5) strength += 1;
    if (password.length > 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  };

  const getStrengthColor = (strength: number) => {
    switch (strength) {
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-yellow-500';
      case 3:
        return 'bg-yellow-400';
      case 4:
        return 'bg-green-500';
      case 5:
        return 'bg-green-700';
      default:
        return 'bg-gray-300';
    }
  };

  const getStrengthLabel = (strength: number) => {
    switch (strength) {
      case 1:
        return 'Too Weak';
      case 2:
        return 'Weak';
      case 3:
        return 'Fair';
      case 4:
        return 'Good';
      case 5:
        return 'Very Strong';
      default:
        return '\u00A0';
    }
  };

  return (
    <div className="mt-2">
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${getStrengthColor(passwordStrength)} transition-all`}
          style={{ width: `${passwordStrength * 20}%` }}
        ></div>
      </div>
      <p className="text-sm mt-1">{getStrengthLabel(passwordStrength)}</p>
    </div>
  );
};

export default PasswordStrengthMeter;