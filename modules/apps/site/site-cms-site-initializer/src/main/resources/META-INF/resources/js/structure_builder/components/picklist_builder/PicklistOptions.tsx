/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {FrontendDataSet} from '@liferay/frontend-data-set-web';
import {sub} from 'frontend-js-web';
import React, {useState} from 'react';

import {
	Option,
	Options,
	useOptions,
	useRemoveOptions,
} from '../../contexts/PicklistBuilderContext';
import getRandomId from '../../utils/getRandomId';
import AddOptionModal from './AddOptionModal';

export default function PicklistOptions() {
	const [modalVisible, setModalVisible] = useState<Boolean>(false);
	const [selectedOption, setSelectedOption] = useState<Option | null>(null);

	const options = useOptions();
	const removeOptions = useRemoveOptions();

	return (
		<>
			{modalVisible && (
				<AddOptionModal
					onCloseModal={() => {
						setModalVisible(false);

						if (selectedOption) {
							setSelectedOption(null);
						}
					}}
					option={{
						erc: selectedOption?.erc || getRandomId(),
						key: selectedOption?.key || getRandomkey(),
						name: selectedOption?.name || {
							[Liferay.ThemeDisplay.getDefaultLanguageId()]:
								Liferay.Language.get('option'),
						},
					}}
				/>
			)}

			<div className="panel-unstyled">
				<h3 className="panel-header panel-title text-secondary">
					{sub(
						Liferay.Language.get('x-options'),
						Liferay.Language.get('picklist')
					)}
				</h3>
			</div>

			<FrontendDataSet
				bulkActions={[
					{icon: 'trash', label: Liferay.Language.get('delete')},
				]}
				creationMenu={{
					primaryItems: [
						{
							label: Liferay.Language.get('add-new'),
							onClick: () => setModalVisible(true),
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
				id="optionList"
				items={toItems(options)}
				itemsActions={[
					{
						icon: 'pencil',
						label: Liferay.Language.get('edit'),
						onClick: ({itemData}: {itemData: Option}) => {
							setSelectedOption(itemData);
							setModalVisible(true);
						},
						type: 'item',
					},
					{
						icon: 'trash',
						label: Liferay.Language.get('delete'),
						onClick: ({itemData}: {itemData: Option}) =>
							removeOptions([itemData.erc]),
						type: 'item',
					},
				]}
				onBulkActionItemClick={({
					selectedData,
				}: {
					selectedData: {keyValues: string[]};
				}) => {
					removeOptions(selectedData.keyValues);
				}}
				style="fluid"
				views={[
					{
						contentRenderer: 'table',
						name: 'table',
						schema: {
							fields: [
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

function getRandomkey() {
	const digits = Math.floor(Math.random() * 9 * Math.pow(10, 5));

	return `${Liferay.Language.get('option')}${digits}`;
}

function toItems(options: Options) {
	return [...options].map(([erc, value]) => ({
		erc,
		id: erc,
		...value,
	}));
}
