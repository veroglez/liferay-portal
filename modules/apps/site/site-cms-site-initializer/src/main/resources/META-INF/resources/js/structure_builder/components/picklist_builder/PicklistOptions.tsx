/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {FrontendDataSet} from '@liferay/frontend-data-set-web';
import {sub} from 'frontend-js-web';
import React from 'react';

export default function PicklistOptions() {
	return (
		<>
			<div className="panel-unstyled">
				<h3 className="panel-header panel-title text-secondary">
					{sub(
						Liferay.Language.get('x-options'),
						Liferay.Language.get('picklist')
					)}
				</h3>
			</div>

			<FrontendDataSet
				creationMenu={{
					primaryItems: [
						{
							label: Liferay.Language.get('new'),
							onClick: () => console.log('add new'),
						},
					],
				}}
				emptyState={{
					description: Liferay.Language.get(
						'fortunately-it-is-very-easy-to-add-new-ones'
					),
					image: '/states/cms_empty_state.svg',
					title: sub(
						Liferay.Language.get('there-are-no-x'),
						Liferay.Language.get('options')
					),
				}}
				id="ViewTags"
				items={[
					{
						erc: '9501cdf5-9f99-406e-b7dd-75ef01cd3925',
						key: 'keyItem1',
						name: 'Item 1',
					},
				]}
				itemsActions={[
					{
						data: {
							id: 'edit',
						},
						icon: 'pencil',
						label: Liferay.Language.get('edit'),
						onClick: () => console.log('edit'),
						type: 'item',
					},
					{
						data: {
							id: 'remove',
						},
						icon: 'trash',
						label: Liferay.Language.get('remove'),
						onClick: () => console.log('remove'),
						type: 'item',
					},
				]}
				selectedItemsKey="key"
				style="fluid"
				views={[
					{
						contentRenderer: 'table',
						name: 'table',
						schema: {
							fields: [
								{
									fieldName: 'select',
									label: '',
								},
								{
									fieldName: 'name',
									label: 'Name',
									sortable: true,
								},
								{
									fieldName: 'key',
									label: 'Key',
								},
								{
									fieldName: 'erc',
									label: 'ERC',
								},
							],
						},
					},
				]}
			/>
		</>
	);
}
