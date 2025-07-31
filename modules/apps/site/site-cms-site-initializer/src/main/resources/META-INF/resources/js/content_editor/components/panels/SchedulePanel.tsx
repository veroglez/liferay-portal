/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayDatePicker from '@clayui/date-picker';
import ClayForm, {ClayCheckbox} from '@clayui/form';
import {datetimeUtils} from '@liferay/object-js-components-web';
import moment from 'moment';
import React, {RefObject, useId, useState} from 'react';

import FieldWrapper from '../../../common/components/forms/FieldWrapper';

export default function SchedulePanel({
	dateConfig,
	expirationDateInputRef,
}: {
	dateConfig: datetimeUtils.DateConfig;
	expirationDateInputRef: RefObject<HTMLInputElement>;
}) {
	const expirationDateInput = expirationDateInputRef.current!;

	return (
		<div className="px-3">
			<p className="text-3 text-secondary">
				{Liferay.Language.get(
					'including-an-expiration-date-will-allow-your-files-to-expire-automatically-and-become-unpublished'
				)}
			</p>

			<ScheduleField
				date={expirationDateInput.dataset.value}
				dateConfig={dateConfig}
				formInput={expirationDateInput}
				label={Liferay.Language.get('expiration-date')}
				neverExpire={expirationDateInput.value === ''}
			/>
		</div>
	);
}

function ScheduleField({
	date: initialDate = '',
	dateConfig,
	formInput,
	label,
	neverExpire,
}: {
	date: string | undefined;
	dateConfig: datetimeUtils.DateConfig;
	formInput: HTMLInputElement;
	label: string;
	neverExpire: boolean;
}) {
	const [checked, setChecked] = useState<boolean>(neverExpire);
	const [date, setDate] = useState<string>(initialDate);

	const id = useId();

	return (
		<div aria-label={label} role="group">
			<FieldWrapper disabled={checked} fieldId={id} label={label}>
				<ClayDatePicker
					dateFormat={dateConfig.clayFormat}
					disabled={checked}
					firstDayOfWeek={dateConfig.firstDayOfWeek}
					id={id}
					months={[
						`${Liferay.Language.get('january')}`,
						`${Liferay.Language.get('february')}`,
						`${Liferay.Language.get('march')}`,
						`${Liferay.Language.get('april')}`,
						`${Liferay.Language.get('may')}`,
						`${Liferay.Language.get('june')}`,
						`${Liferay.Language.get('july')}`,
						`${Liferay.Language.get('august')}`,
						`${Liferay.Language.get('september')}`,
						`${Liferay.Language.get('october')}`,
						`${Liferay.Language.get('november')}`,
						`${Liferay.Language.get('december')}`,
					]}
					onChange={(value: string) => {
						setDate(value);
					}}
					placeholder={dateConfig.placeholder}
					time
					value={date}
					years={{
						end: new Date().getFullYear() + 5,
						start: new Date().getFullYear(),
					}}
				/>
			</FieldWrapper>

			<ClayForm.Group>
				<ClayCheckbox
					checked={checked}
					label={Liferay.Language.get('never-expire')}
					onChange={({target: {checked}}) => {
						setChecked(checked);

						updateDateInput({
							dateConfig,
							formInput,
							neverExpire: checked,
							value: checked ? '' : date,
						});
					}}
				/>
			</ClayForm.Group>
		</div>
	);
}

function updateDateInput({
	dateConfig,
	formInput,
	neverExpire = false,
	value,
}: {
	dateConfig: datetimeUtils.DateConfig;
	formInput: HTMLInputElement;
	neverExpire?: boolean;
	value: string;
}) {
	if (neverExpire) {
		formInput.value = '';
	}
	else {
		formInput.dataset.value = value;
		formInput.value = toServerFormat(value, dateConfig).replace(' ', 'T');
	}
}

function toServerFormat(value: string, dateConfig: datetimeUtils.DateConfig) {
	return moment(value, dateConfig.momentFormat, true).format(
		dateConfig.serverFormat
	);
}
