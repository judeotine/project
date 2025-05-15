import { userSignal } from '@/store';

const Profile = () => {
  const userType = userSignal.value?.userType;
  return <div>{userType === 'seller' ? 'Seller' : 'Buyer'}</div>;
};

export default Profile;
