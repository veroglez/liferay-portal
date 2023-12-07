/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {
	Language,
	Translation,
	TranslationSelector,
} from '@liferay/layout-js-components-web';
import React, {useCallback, useEffect, useState} from 'react';

type Field = Record<Liferay.Language.Locale, string>;

interface Props {
	defaultLanguageId: Liferay.Language.Locale;
	fields: Record<string, Field>;
	languages: Language[];
	portletNamespace: string;
	selectedLanguageId: Liferay.Language.Locale;
}

export default function TranslationManager({
	defaultLanguageId,
	fields,
	languages,
	portletNamespace,
	selectedLanguageId,
}: Props) {
	const [translations, setTranslations] = useState<Translation[]>(
		fieldToTranslation(fields)
	);

	const getTranslations = useCallback(
		() =>
			translations.map(({fieldName}) => {
				const languages = Array.from(
					document.querySelectorAll<HTMLInputElement>(
						`[type="hidden"][id*="${portletNamespace}${fieldName}_"]`
					)
				)
					.filter((input) => input.value)
					.map(
						({dataset}) =>
							dataset.languageid as Liferay.Language.Locale
					);

				return {
					fieldName,
					languages,
				};
			}),
		[portletNamespace, translations]
	);

	useEffect(() => {
		Liferay.on('inputLocalized:updateTranslationStatus', () =>
			setTranslations(getTranslations())
		);
	}, [getTranslations]);

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
			showManageTranslationButton={true}
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
