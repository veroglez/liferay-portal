/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import moment from 'moment';

import {
	dateConfig,
	toServerFormat,
} from '../../content_editor/components/ScheduleField';

// The Object entry REST API expects dates as "yyyy-MM-dd'T'HH:mm:ss'Z'". Mirror
// the object entry schedule form (convertToUTC): stamp the entered wall-clock
// time with a "Z" suffix so the value round-trips with the other date fields.

export function toObjectEntryDate(value: string): string {
	return moment(value, dateConfig.momentFormat, true).format(
		'YYYY-MM-DDTHH:mm:ss[Z]'
	);
}

function isPastDate(value: string): boolean {
	const languageId = Liferay.ThemeDisplay.getBCP47LanguageId();
	const timeZone = Liferay.ThemeDisplay.getTimeZone();

	const timeZoneDateTime = new Date(
		new Date().toLocaleString(languageId, {timeZone})
	);

	return timeZoneDateTime >= new Date(toServerFormat(value));
}

export function getReviewDateError(value: string): string {

	// An empty value clears the review date (never review), which is allowed.

	if (!value) {
		return '';
	}

	if (!moment(value, dateConfig.momentFormat, true).isValid()) {
		return Liferay.Language.get('the-field-value-is-invalid');
	}

	if (isPastDate(value)) {
		return Liferay.Language.get('the-date-entered-is-in-the-past');
	}

	return '';
}
