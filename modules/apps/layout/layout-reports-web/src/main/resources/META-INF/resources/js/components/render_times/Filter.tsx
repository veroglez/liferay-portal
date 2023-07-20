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

import {ClayButtonWithIcon} from '@clayui/button';
import {SearchForm} from '@liferay/layout-js-components-web';
import {sub} from 'frontend-js-web';
import React from 'react';

export default function Filter({
	isAscendingSort,
	onSearchValue,
	onSort,
}: {
	isAscendingSort: boolean;
	onSearchValue: Function;
	onSort: Function;
}) {
	const label = sub(
		Liferay.Language.get('x-sort-fragments-by-render-time'),
		isAscendingSort
			? Liferay.Language.get('descending')
			: Liferay.Language.get('ascending')
	);

	return (
		<div className="d-flex pt-1">
			<SearchForm
				className="flex-grow-1"
				label={Liferay.Language.get('search-fragments')}
				onChange={onSearchValue}
			/>

			<ClayButtonWithIcon
				aria-label={label}
				borderless
				className="ml-2 mt-0"
				displayType="secondary"
				onClick={() => onSort(!isAscendingSort)}
				size="sm"
				symbol={isAscendingSort ? 'order-list-up' : 'order-list-down'}
				title={label}
			/>
		</div>
	);
}
