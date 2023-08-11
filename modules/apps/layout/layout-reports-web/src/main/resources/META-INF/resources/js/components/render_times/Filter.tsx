/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ClayButtonWithIcon} from '@clayui/button';
import {ClayDropDownWithItems} from '@clayui/drop-down';
import {SearchForm} from '@liferay/layout-js-components-web';
import {sub} from 'frontend-js-web';
import React from 'react';

import {FragmentsFilter} from '../../constants/fragments';

interface Props {
	filter: FragmentsFilter;
	isAscendingSort: boolean;
	onSearchValue: Function;
	onSort: Function;
}

export default function Filter({
	filter,
	isAscendingSort,
	onSearchValue,
	onSort,
}: Props) {
	const sortLabel = sub(
		Liferay.Language.get('x-sort-fragments-by-render-time'),
		isAscendingSort
			? Liferay.Language.get('descending')
			: Liferay.Language.get('ascending')
	);

	const getItems = (filterItem: object) => {
		const [[type, items]] = Object.entries(filterItem);

		return items.map(({label, value}: {label: string; value: boolean}) => {
			return {
				active: filter[type as keyof typeof filter] === value,
				label,
			};
		});
	};

	return (
		<div className="d-flex pt-1">
			<SearchForm
				className="flex-grow-1"
				label={Liferay.Language.get('search-fragments')}
				onChange={onSearchValue}
			/>

			<ClayDropDownWithItems
				items={[
					{
						items: getItems({
							fromMaster: [
								{
									label: Liferay.Language.get('all'),
									value: false,
								},
								{
									label: Liferay.Language.get('from-master'),
									value: true,
								},
							],
						}),
						label: Liferay.Language.get('filter-by-navigation'),
						type: 'group',
					},
					{
						items: getItems({
							fragment: [
								{
									label: Liferay.Language.get('fragment'),
									value: true,
								},
								{
									label: Liferay.Language.get('widget'),
									value: false,
								},
							],
						}),
						label: Liferay.Language.get('filter-by-type'),
						type: 'group',
					},
					{
						items: getItems({
							cached: [
								{
									label: Liferay.Language.get('cached'),
									value: true,
								},
								{
									label: Liferay.Language.get('not-cached'),
									value: false,
								},
							],
						}),
						label: Liferay.Language.get('filter-by-status'),
						type: 'group',
					},
				]}
				trigger={
					<ClayButtonWithIcon
						aria-label={Liferay.Language.get('filter')}
						borderless
						className="ml-2 mt-0"
						displayType="secondary"
						size="sm"
						symbol="filter"
						title={Liferay.Language.get('filter')}
					/>
				}
			/>

			<ClayButtonWithIcon
				aria-label={sortLabel}
				borderless
				className="ml-2 mt-0"
				displayType="secondary"
				onClick={() => onSort(!isAscendingSort)}
				size="sm"
				symbol={isAscendingSort ? 'order-list-up' : 'order-list-down'}
				title={sortLabel}
			/>
		</div>
	);
}
