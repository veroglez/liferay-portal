/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {
	Language,
	Translation,
	TranslationSelector,
} from '@liferay/layout-js-components-web';
import React, {useState} from 'react';

type Field = Record<Liferay.Language.Locale, string>;

interface Props {
	defaultLanguageId: Liferay.Language.Locale;
	fields: Record<string, Field>;
	languages: Language[];
	selectedLanguageId: Liferay.Language.Locale;
}

export default function TranslationManager({
	defaultLanguageId,
	fields,
	languages,
	selectedLanguageId,
}: Props) {
	const [translations] = useState<Translation[]>(fieldToTranslation(fields));

	return (
		<TranslationSelector
			defaultLanguageId={defaultLanguageId}
			languages={languages}
			onSelectedLanguageChange={(languageId) => {
				Liferay.fire('inputLocalized:localeChanged', {
					item: document.querySelector(
						`[data-languageid="${languageId}"]`
					),
				});
			}}
			selectedLanguageId={selectedLanguageId}
			translations={translations}
		/>
	);
}

function fieldToTranslation(fields: Record<string, Field>) {
	const translations = [];

	for (const fieldName in fields) {
		const languages = fields[fieldName]
			? (Object.keys(fields[fieldName]) as Liferay.Language.Locale[])
			: [];

		translations.push({
			fieldName,
			languages,
		});
	}

	return translations;
}
