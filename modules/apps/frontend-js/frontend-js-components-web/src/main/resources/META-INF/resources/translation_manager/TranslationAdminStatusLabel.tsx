/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {DisplayType} from '@clayui/alert';
import ClayLabel from '@clayui/label';
import ClayLayout from '@clayui/layout';
import React from 'react';

interface Props {
	defaultLanguageId: Liferay.Language.Locale;
	labels: {
		default: string;
		notTranslated: string;
		translated: string;
	};
	languageId: Liferay.Language.Locale;
	localeValue: string | null;
}

interface Status {
	displayType: DisplayType;
	label: string;
}

export default function TranslationAdminStatusLabel({
	defaultLanguageId,
	labels,
	languageId,
	localeValue,
}: Props) {
	let status: Status = {displayType: 'warning', label: labels.notTranslated};

	if (languageId === defaultLanguageId) {
		status = {displayType: 'info', label: labels.default};
	}
	else if (localeValue) {
		status = {displayType: 'success', label: labels.translated};
	}

	return (
		<ClayLayout.ContentCol containerElement="span">
			<ClayLayout.ContentSection>
				<ClayLabel displayType={status.displayType}>
					{status.label}
				</ClayLabel>
			</ClayLayout.ContentSection>
		</ClayLayout.ContentCol>
	);
}
