import React from 'react'
import Profile from '../../../music-components/Profile'

const CreatorInfo = ({ color = "red" }) => {
	const [openTab, setOpenTab] = React.useState(1);
	return (
		<>
		<Profile type="creator"/>
		</>
	);
};

export default CreatorInfo;