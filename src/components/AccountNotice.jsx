const accountNoticeStyles = `
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700;800&family=Lilita+One&family=Nunito:wght@600;700;800&display=swap');

.account-notice-backdrop {
  position: absolute;
  inset: 0;
  z-index: 200;
  background: rgba(20, 10, 5, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  box-sizing: border-box;
  animation: accountNoticeFadeIn 0.18s ease-out;
}

@keyframes accountNoticeFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes accountNoticePopIn {
  from {
    opacity: 0;
    transform: scale(0.92) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.account-notice-frame {
  box-sizing: border-box;
  width: 100%;
  max-width: 440px;
  background: #C48B56;
  border: 4px solid #361E10;
  border-radius: 16px;
  padding: 14px;
  display: flex;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.45);
  animation: accountNoticePopIn 0.2s cubic-bezier(0.34, 1.35, 0.64, 1);
  user-select: none;
}

.account-notice-board {
  box-sizing: border-box;
  width: 100%;
  background: #FFF4DF;
  border: 3px solid #361E10;
  border-radius: 4px;
  box-shadow: inset -10px 0 0 rgba(54, 30, 16, 0.18);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 28px 28px;
}

.account-notice-title {
  margin: 0 0 20px 0;
  font-family: 'Lilita One', 'Fredoka', cursive, sans-serif;
  font-weight: 700;
  font-size: 40px;
  color: #361E10;
  text-align: center;
  letter-spacing: 0.02em;
  line-height: 1;
}

.account-notice-icon {
  width: 54px;
  height: 54px;
  display: block;
}

.account-notice-heading {
  margin: 18px 0 8px 0;
  font-family: 'Nunito', 'Fredoka', sans-serif;
  font-weight: 800;
  font-size: 21px;
  line-height: 1.25;
  color: #5A3824;
  text-align: center;
}

.account-notice-text {
  margin: 0 0 6px 0;
  font-family: 'Nunito', 'Fredoka', sans-serif;
  font-weight: 700;
  font-size: 13.5px;
  line-height: 1.4;
  color: #361E10;
  text-align: center;
}

.account-notice-text strong {
  font-weight: 900;
}

.account-notice-btn {
  margin-top: 20px;
  height: 48px;
  padding: 0 40px;
  border: 2.5px solid #361E10;
  border-radius: 12px;
  color: #FFFFFF;
  font-family: 'Nunito', 'Fredoka', sans-serif;
  font-weight: 800;
  font-size: 19px;
  cursor: pointer;
  outline: none;
  transition: transform 0.12s ease, filter 0.12s ease;
}

.account-notice-btn.is-reset {
  background: #A9BC5C;
}

.account-notice-btn.is-deleted {
  background: #8C3023;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.account-notice-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.06);
}

.account-notice-btn:active {
  transform: translateY(2px);
  filter: brightness(0.96);
}
`;

function AccountNotice({ type, username, onChangeUsername, onBackToLogin }) {
  const isDeleted = type === 'deleted';

  return (
    <>
      <style>{accountNoticeStyles}</style>
      <div
        className="account-notice-backdrop"
        role="alertdialog"
        aria-modal="true"
        aria-label="Notification"
      >
        <div className="account-notice-frame">
          <div className="account-notice-board">
            <h2 className="account-notice-title">NOTIFICATION</h2>

            <svg className="account-notice-icon" viewBox="0 0 54 54" aria-hidden="true">
              <circle cx="27" cy="27" r="25" fill="#B97C49" stroke="#361E10" strokeWidth="3" />
              <path
                d="M27 14 L41 38 H13 Z"
                fill="none"
                stroke="#5A3824"
                strokeWidth="4"
                strokeLinejoin="round"
              />
              <line
                x1="27"
                y1="23"
                x2="27"
                y2="30"
                stroke="#5A3824"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle cx="27" cy="34" r="2" fill="#5A3824" />
            </svg>

            {isDeleted ? (
              <>
                <p className="account-notice-heading">Your account has been deleted.</p>
                <p className="account-notice-text">
                  The admin has removed this account, so you can’t keep playing with it.
                </p>
                <button
                  type="button"
                  className="account-notice-btn is-deleted"
                  onClick={onBackToLogin}
                  autoFocus
                >
                  Back to login
                </button>
              </>
            ) : (
              <>
                <p className="account-notice-heading">
                  The admin requires you to change your username.
                </p>
                <p className="account-notice-text">Choose a new one to keep playing.</p>
                <p className="account-notice-text">
                  If you don’t change it, you’ll need to log in with your default username
                  {username ? <> <strong>{username}</strong></> : null}.
                </p>
                <p className="account-notice-text">
                  Once you change it, your new username is what you’ll use to log in.
                </p>
                <button
                  type="button"
                  className="account-notice-btn is-reset"
                  onClick={onChangeUsername}
                  autoFocus
                >
                  Change Username
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AccountNotice;