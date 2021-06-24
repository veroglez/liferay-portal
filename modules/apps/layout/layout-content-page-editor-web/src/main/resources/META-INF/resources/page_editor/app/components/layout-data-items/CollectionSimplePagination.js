/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import ClayButton from '@clayui/button';
import PropTypes from 'prop-types';
import React from 'react';

const CollectionSimplePagination = ({activePage, onChangePage, totalPages}) => {
	const buttons = [
		{
			disabled: activePage === 1,
			label: Liferay.Language.get('previous'),
			onClick: () => onChangePage(activePage - 1),
		},
		{
			disabled: activePage === totalPages,
			label: Liferay.Language.get('next'),
			onClick: () => onChangePage(activePage + 1),
		},
	];

	return (
		<div className="page-editor__collection__pagination--simple">
			{buttons.map(({disabled, label, onClick}) => (
				<ClayButton
					disabled={disabled}
					displayType="unstyled"
					key={label}
					onClick={onClick}
				>
					<span className="c-inner" tabIndex="-1">
						{label}
					</span>
				</ClayButton>
			))}
		</div>
	);
};

export default CollectionSimplePagination;

CollectionSimplePagination.propTypes = {
	activePage: PropTypes.number,
	onChangePage: PropTypes.func,
	totalPages: PropTypes.number,
};
