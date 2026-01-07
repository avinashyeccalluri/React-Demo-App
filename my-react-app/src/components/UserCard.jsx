import PropTypes from 'prop-types';
import './UserCard.css';

const UserCard = ({ name, age, email, role }) => {
  return (
    <div className="user-card">
      <h3>{name}</h3>
      <p><strong>Age:</strong> {age}</p>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Role:</strong> {role}</p>
    </div>
  );
};

UserCard.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number.isRequired,
  email: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
};

export default UserCard;
