/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayForm from '@clayui/form';
import ClayLayout from '@clayui/layout';
import classNames from 'classnames';
import {InputLocalized, ManagementToolbar} from 'frontend-js-components-web';
import React, {useState} from 'react';

import {Config, initializeConfig} from '../../config';
import PicklistService from '../../services/PicklistService';
import getRandomId from '../../utils/getRandomId';
import AsyncButton from '../AsyncButton';
import ManagementBar from '../BaseManagementBar';
import ERCInput from '../ERCInput';

export default function PicklistBuilder({config}: {config: Config}) {
	initializeConfig(config);

	const [name, setName] = useState<Liferay.Language.LocalizedValue<string>>({
		[Liferay.ThemeDisplay.getDefaultLanguageId()]:
			Liferay.Language.get('untitled-structure'),
	});
	const [erc, setErc] = useState<string>(getRandomId());

	const onSave = async () => {
		try {
			await PicklistService.createPicklist({erc, name});

			console.log('se ha guardado');
		}
		catch (error) {
			const {message} = error as Error;

			console.log('no se ha guardado', message);
		}
	};

	return (
		<div className="d-flex flex-column">
			<ManagementBar title={Liferay.Language.get('new-picklist')}>
				<ManagementToolbar.Item>
					<AsyncButton
						displayType="primary"
						label={Liferay.Language.get('save')}
						onClick={onSave}
					/>
				</ManagementToolbar.Item>
			</ManagementBar>

			<ClayLayout.ContainerFluid className="px-4" size="md" view>
				<ClayForm.Group className={classNames({'has-error': !name})}>
					<InputLocalized
						aria-label={Liferay.Language.get('structure-label')}
						error={
							name
								? ''
								: Liferay.Language.get('this-field-is-required')
						}
						label={Liferay.Language.get('name')}
						onBlur={() => {
							setName(name);
						}}
						onChange={(name) => setName(name)}
						required
						translations={
							name as Liferay.Language.LocalizedValue<string>
						}
					/>

					<ERCInput onValueChange={setErc} value={erc} />
				</ClayForm.Group>
			</ClayLayout.ContainerFluid>
		</div>
	);
}
