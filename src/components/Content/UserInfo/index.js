import React from 'react'
import Profile from '../../../music-components/Profile'

const UserInfo = ({ color = "red" }) => {
	const [openTab, setOpenTab] = React.useState(1);
	return (
		<>
		<Profile/>
		</>
	);
};

export default UserInfo;