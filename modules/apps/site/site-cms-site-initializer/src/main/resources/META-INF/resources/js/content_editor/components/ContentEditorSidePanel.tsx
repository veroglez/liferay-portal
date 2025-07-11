/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {ClayButtonWithIcon} from '@clayui/button';

import '../../../css/content_editor/ContentEditorSidePanel.scss';

import {Button, VerticalBar} from '@clayui/core';
import ClayIcon from '@clayui/icon';
import {LiferayEditorConfig} from 'frontend-editor-ckeditor-web';
import {fetch} from 'frontend-js-web';
import React, {useState} from 'react';

import CommentsPanel, {Comment} from './panels/CommentsPanel';
import GeneralPanel from './panels/GeneralPanel';

type Props = {
	addCommentURL: string;
	comments: Comment[];
	editorConfig: {configJSONObject: LiferayEditorConfig};
	id: string;
	isSubscribed: boolean;
	subscribeURL: string;
	type: string;
	version: string;
};

type Item = {
	component: React.ComponentType<Props>;
	divider?: boolean;
	icon: string;
	title: string;
};

const items: Item[] = [
	{
		component: GeneralPanel,
		icon: 'info-circle',
		title: Liferay.Language.get('general'),
	},
	{
		component: CommentsPanel,
		icon: 'comments',
		title: Liferay.Language.get('comments'),
	},
];

export default function ContentEditorSidePanel(props: Props) {
	const [panel, setPanel] = useState<React.Key | null>(null);

	return (
		<VerticalBar
			active={panel}
			className="content-editor__side-panel"
			onActiveChange={setPanel}
		>
			<VerticalBar.Content items={items}>
				{(item) => {
					const Component = item.component;

					return (
						<VerticalBar.Panel key={item.title}>
							<div className="align-items-center border-0 d-flex justify-content-between sidebar-header">
								<div className="component-title">
									{item.title}
								</div>

								<div>
									{item.title === 'Comments' ? (
										<SubscribeButton
											isSubscribed={props.isSubscribed}
											subscribeURL={props.subscribeURL}
										/>
									) : null}

									<ClayButtonWithIcon
										aria-label={Liferay.Language.get(
											'close'
										)}
										borderless
										displayType="secondary"
										monospaced
										onClick={() => setPanel(null)}
										size="sm"
										symbol="times"
										title={Liferay.Language.get('close')}
									/>
								</div>
							</div>

							<Component {...props} />
						</VerticalBar.Panel>
					);
				}}
			</VerticalBar.Content>

			<VerticalBar.Bar displayType="light" items={items}>
				{(item) => (
					<VerticalBar.Item divider={item.divider} key={item.title}>
						<Button aria-label={item.title} displayType={null}>
							<ClayIcon symbol={item.icon} />
						</Button>
					</VerticalBar.Item>
				)}
			</VerticalBar.Bar>
		</VerticalBar>
	);
}

function SubscribeButton({
	isSubscribed,
	subscribeURL,
}: {
	isSubscribed: boolean;
	subscribeURL: string;
}) {
	const [subscribe, setSubscribe] = useState<boolean>(isSubscribed);

	const title = subscribe
		? Liferay.Language.get('subscribe')
		: Liferay.Language.get('unsubscribe');

	return (
		<ClayButtonWithIcon
			aria-label={title}
			borderless
			displayType="secondary"
			monospaced
			onClick={async () => {
				await fetch(
					`${subscribeURL}&cmd=${!subscribe ? 'subscrib' : 'unsubscribe'}`,
					{method: 'GET'}
				);

				setSubscribe(!subscribe);
			}}
			size="sm"
			symbol={subscribe ? 'bell-on' : 'bell-off'}
			title={title}
		/>
	);
}
