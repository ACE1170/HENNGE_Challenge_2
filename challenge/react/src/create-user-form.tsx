import { useEffect, useState, type CSSProperties, type Dispatch, type SetStateAction, FormEvent } from 'react';

interface CreateUserFormProps {
  setUserWasCreated: Dispatch<SetStateAction<boolean>>;
}

function CreateUserForm({ setUserWasCreated }: CreateUserFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [buttonHovered, setButtonHovered] = useState(false);

  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsia3Jpc2huYWhzaGFybWExMTcwQGdtYWlsLmNvbSJdLCJpc3MiOiJoZW5uZ2UtYWRtaXNzaW9uLWNoYWxsZW5nZSIsInN1YiI6ImNoYWxsZW5nZSJ9.xZT403iFLFLjMCmWzq6bq9RZMtjL1WbViqgQ6oyoQ7o'; // Replace with your actual token

  // Inject CSS keyframes dynamically once on component mount
  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      @keyframes gradientShift {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
    `;
    document.head.appendChild(styleTag);

    return () => {
      document.head.removeChild(styleTag); // cleanup on unmount
    };
  }, []);

  // Password criteria checks
  const criteria = [
    { label: 'At least 8 characters', test: (pw: string) => pw.length >= 8 },
    { label: 'Contains uppercase letter', test: (pw: string) => /[A-Z]/.test(pw) },
    { label: 'Contains lowercase letter', test: (pw: string) => /[a-z]/.test(pw) },
    { label: 'Contains number', test: (pw: string) => /\d/.test(pw) },
    { label: 'Contains special character', test: (pw: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pw) },
  ];

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await fetch(
        'https://api.challenge.hennge.com/password-validation-challenge-api/001/challenge-signup',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ username, password }),
        }
      );

      if (res.ok) {
        setUserWasCreated(true);
      } else if (res.status === 400) {
        setErrorMessage('Sorry, the entered password is not allowed, please try a different one.');
      } else if (res.status === 401 || res.status === 403) {
        setErrorMessage('Not authenticated to access this resource.');
      } else {
        setErrorMessage('Something went wrong, please try again.');
      }
    } catch {
      setErrorMessage('Something went wrong, please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={animatedBackgroundWrapper}>
      <div style={formWrapper}>
        <form style={form} onSubmit={handleSubmit} aria-label="Create user form" noValidate>
          <h2 style={formHeading}>Create User</h2>

          <label htmlFor="username" style={formLabel}>Username</label>
          <input
            id="username"
            name="username"
            type="text"
            style={{
              ...formInput,
              borderColor: usernameFocused ? '#6a4de8' : '#ccc',
              boxShadow: usernameFocused ? '0 0 8px rgba(106, 77, 232, 0.4)' : 'none',
            }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onFocus={() => setUsernameFocused(true)}
            onBlur={() => setUsernameFocused(false)}
            required
            disabled={isSubmitting}
            placeholder="Enter your username"
            aria-required="true"
          />

          <label htmlFor="password" style={formLabel}>Password</label>
          <input
            id="password"
            name="password"
            type="password"
            style={{
              ...formInput,
              borderColor: passwordFocused ? '#6a4de8' : '#ccc',
              boxShadow: passwordFocused ? '0 0 8px rgba(106, 77, 232, 0.4)' : 'none',
            }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            required
            disabled={isSubmitting}
            placeholder="Enter your password"
            aria-describedby="password-criteria"
            aria-required="true"
          />

          {/* Password criteria checklist */}
          <ul id="password-criteria" style={criteriaList}>
            {criteria.map(({ label, test }, i) => {
              const passed = test(password);
              return (
                <li
                  key={i}
                  style={{
                    color: passed ? '#4caf50' : '#d93025',
                    fontWeight: passed ? '600' : '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '14px',
                    userSelect: 'none',
                  }}
                >
                  <span aria-hidden="true" style={{ fontWeight: 'bold' }}>
                    {passed ? '✔' : '✘'}
                  </span>
                  {label}
                </li>
              );
            })}
          </ul>

          {errorMessage && <p style={errorMessageStyle} role="alert">{errorMessage}</p>}

          <button
            type="submit"
            style={{
              ...formButton,
              backgroundColor: isSubmitting
                ? '#a39ddf'
                : buttonHovered
                ? '#5636d7'
                : '#6a4de8',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              boxShadow: buttonHovered && !isSubmitting ? '0 4px 12px rgba(106, 77, 232, 0.5)' : 'none',
              transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
            }}
            disabled={isSubmitting}
            onMouseEnter={() => setButtonHovered(true)}
            onMouseLeave={() => setButtonHovered(false)}
          >
            {isSubmitting ? 'Creating...' : 'Create User'}
          </button>
        </form>
      </div>
    </div>
  );
}

export { CreateUserForm };

// Styles below

const animatedBackgroundWrapper: CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(270deg, #757f9a, #d7dde8, #757f9a)',
  backgroundSize: '600% 600%',
  animation: 'gradientShift 20s ease infinite',
};

const formWrapper: CSSProperties = {
  maxWidth: '480px',
  width: '90%',
  backgroundColor: '#d3d3d3',
  padding: '32px',
  borderRadius: '12px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
  fontFamily: "'Inter', system-ui, Avenir, Helvetica, Arial, sans-serif",
};

const form: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const formHeading: CSSProperties = {
  marginBottom: '12px',
  fontSize: '1.8rem',
  color: '#4a4a4a',
  textAlign: 'center',
};

const formLabel: CSSProperties = {
  fontWeight: 600,
  fontSize: '14px',
  color: '#333',
  userSelect: 'none',
};

const formInput: CSSProperties = {
  outline: 'none',
  padding: '12px 16px',
  fontSize: '16px',
  borderRadius: '6px',
  border: '1.8px solid #ccc',
  transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
};

const criteriaList: CSSProperties = {
  listStyle: 'none',
  paddingLeft: '16px',
  marginTop: '-8px',
  marginBottom: '4px',
};

const formButton: CSSProperties = {
  padding: '12px 20px',
  fontSize: '16px',
  fontWeight: 600,
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  alignSelf: 'center',
  width: '50%',
};

const errorMessageStyle: CSSProperties = {
  color: '#d93025',
  fontWeight : '600',
fontSize: '14px',
textAlign: 'center',
marginTop: '-8px',
marginBottom: '4px',
};