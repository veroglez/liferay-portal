/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ClayButtonWithIcon} from '@clayui/button';
import {ClayDropDownWithItems} from '@clayui/drop-down';
import {SearchForm} from '@liferay/layout-js-components-web';
import {sub} from 'frontend-js-web';
import React from 'react';

import {FragmentFilter} from '../../constants/fragments';

interface Props {
	filters: FragmentFilter;
	isAscendingSort: boolean;
	onFilterValue: Function;
	onSearchValue: Function;
	onSort: Function;
}

interface Option {
	group: string;
	label: string;
	value: string;
}

export default function Filter({
	filters,
	isAscendingSort,
	onFilterValue,
	onSearchValue,
	onSort,
}: Props) {
	const sortLabel = sub(
		Liferay.Language.get('x-sort-fragments-by-render-time'),
		isAscendingSort
			? Liferay.Language.get('descending')
			: Liferay.Language.get('ascending')
	);

	const getOptions = (options: Option[]) => {
		return options.map((option) => ({
			...option,
			active:
				filters[option.group as keyof FragmentFilter] === option.value,
			onClick: () =>
				onFilterValue((filter: {}) => {
					return {...filter, [option.group]: option.value};
				}),
		}));
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
						items: getOptions([
							{
								group: 'origin',
								label: Liferay.Language.get('all'),
								value: 'all',
							},
							{
								group: 'origin',
								label: Liferay.Language.get('from-master'),
								value: 'fromMaster',
							},
						]),
						label: `${Liferay.Language.get('filter-by')}...`,
						type: 'group',
					},

					{
						items: getOptions([
							{
								group: 'type',
								label: Liferay.Language.get('fragment'),
								value: 'fragment',
							},
							{
								group: 'type',
								label: Liferay.Language.get('widget'),
								value: 'widget',
							},
						]),
						label: Liferay.Language.get('filter-by-type'),
						type: 'group',
					},
					{
						items: getOptions([
							{
								group: 'status',
								label: Liferay.Language.get('cached'),
								value: 'cached',
							},
							{
								group: 'status',
								label: Liferay.Language.get('not-cached'),
								value: 'notCached',
							},
						]),
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
