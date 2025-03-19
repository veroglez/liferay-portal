/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton, {ClayButtonWithIcon} from '@clayui/button';
import {Option, Picker} from '@clayui/core';
import {ClayDropDownWithItems} from '@clayui/drop-down';
import ClayForm, {ClayInput} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import {usePrevious} from '@liferay/frontend-js-react-web';
import classNames from 'classnames';
import {FieldFeedback, useId} from 'frontend-js-components-web';
import {sub} from 'frontend-js-web';
import React, {useEffect, useState} from 'react';

import {useSelector, useStateDispatch} from '../contexts/StateContext';
import selectPublishedFields from '../selectors/selectPublishedFields';
import ListTypeService from '../services/ListTypeService';
import {Field, SingleSelectField} from '../utils/field';

type Picklist = {
	id: React.Key;
	name: string;
};

export default function getSingleSelectFieldComponents(): {
	FirstSectionComponent?: React.FC<{field: Field}>;
	SecondSectionComponent?: React.FC<{field: Field}>;
} {
	return {
		FirstSectionComponent,
	};
}

function FirstSectionComponent({field}: {field: Field}) {
	const singleSelectField = field as SingleSelectField;

	const [active, setActive] = useState<boolean>(false);
	const [hasError, setHasError] = useState<boolean>(false);
	const [picklists, setPicklists] = useState<Picklist[]>([]);
	const [selectedKey, setSelectedKey] = useState<React.Key>(
		singleSelectField.listTypeDefinitionId
	);

	const dispatch = useStateDispatch();
	const publishedFields = useSelector(selectPublishedFields);

	const isPublished = publishedFields.has(field.uuid);

	const feedbackId = useId();
	const pickerId = useId();

	useEffect(() => {
		const fetchData = async () => {
			const listTypeDefinitions =
				await ListTypeService.getListTypeDefinitions();

			setPicklists(listTypeDefinitions.items);
		};

		fetchData();
	}, []);

	const previousActive = usePrevious(active);

	useEffect(() => {

		// An error appears when the picker is open, clicked outside
		// and no valid option is selected.

		if (previousActive && !active && selectedKey === '') {
			dispatch({
				type: 'update-field',
				uuid: field.uuid,
			});

			setHasError(true);
		}
	}, [active, dispatch, field.uuid, previousActive, selectedKey]);

	return (
		<ClayForm.Group className={classNames('mb-2', {'has-error': hasError})}>
			<ClayInput.Group className="align-items-end">
				<ClayInput.GroupItem>
					<label htmlFor={pickerId}>
						{Liferay.Language.get('picklist')}

						<ClayIcon
							className="ml-1 reference-mark"
							symbol="asterisk"
						/>
					</label>

					<Picker
						active={active}
						aria-describedby={feedbackId}
						aria-label={sub(
							Liferay.Language.get('select-x'),
							Liferay.Language.get('picklist')
						)}
						disabled={isPublished}
						id={pickerId}
						items={picklists}
						onActiveChange={setActive}
						onBlur={() => {
							if (selectedKey === '') {
								dispatch({
									type: 'update-field',
									uuid: field.uuid,
								});

								setHasError(true);
							}
						}}
						onSelectionChange={(selectedKey: React.Key) => {
							dispatch({
								listTypeDefinitionId: selectedKey as string,
								type: 'update-field',
								uuid: field.uuid,
							});

							setSelectedKey(selectedKey);

							if (selectedKey && hasError) {
								setHasError(false);
							}
						}}
						selectedKey={selectedKey}
					>
						{(item) => <Option key={item.id}>{item.name}</Option>}
					</Picker>
				</ClayInput.GroupItem>

				<ClayInput.GroupItem shrink>
					{selectedKey ? (
						<ClayDropDownWithItems
							items={[
								{
									label: Liferay.Language.get('edit'),
									symbolLeft: 'pencil',
								},
								{type: 'divider'},
								{
									label: Liferay.Language.get('new-picklist'),
									symbolRight: 'shortcut',
								},
							]}
							trigger={
								<ClayButtonWithIcon
									displayType="secondary"
									symbol="ellipsis-v"
									title={Liferay.Language.get('more-actions')}
								/>
							}
						/>
					) : (
						<ClayButton displayType="secondary">
							{Liferay.Language.get('new-picklist')}

							<ClayIcon className="ml-2" symbol="shortcut" />
						</ClayButton>
					)}
				</ClayInput.GroupItem>

				{hasError ? (
					<FieldFeedback
						errorMessage={Liferay.Language.get(
							'this-field-is-required'
						)}
						id={feedbackId}
					/>
				) : null}
			</ClayInput.Group>
		</ClayForm.Group>
	);
}
