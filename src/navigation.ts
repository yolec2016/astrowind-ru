import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Главная',
      href: getPermalink('/'),
    },

    {
      text: 'Продукция',
      links: [
        {
          text: 'Электрические чайники',
          href: getPermalink('/electric-kettle-manufacturer'),
        },
        {
          text: 'Чайники для кофе',
          href: getPermalink('/electric-kettle-manufacturer'),
        },
        {
          text: 'Рисоварки',
          href: getPermalink('/electric-rice-cooker-manufacturer'),
        },
        {
          text: 'Скороварки',
          href: getPermalink('/electric-pressure-cooker-manufacturer'),
        },
        {
          text: 'Электрические ланч-боксы',
          href: getPermalink('/electric-lunch-box-manufacturer'),
        },
      ],
    },

    {
      text: 'OEM / ODM',
      links: [
        {
          text: 'OEM/ODM производство',
          href: getPermalink('/oem'),
        },
        {
          text: 'Цены и OEM стоимость',
          href: getPermalink('/pricing'),
        },
        {
          text: 'Private Label',
          href: getPermalink('/private-label'),
        },
        {
          text: 'Контроль качества',
          href: getPermalink('/quality-control'),
        },
      ],
    },

    {
      text: 'О фабрике',
      links: [
        {
          text: 'О компании',
          href: getPermalink('/about'),
        },
        {
          text: 'Наша фабрика',
          href: getPermalink('/fabrika'),
        },
        {
          text: 'Блог',
          href: getBlogPermalink(),
        },
        {
          text: 'Часто задаваемые вопросы',
          href: getPermalink('/faq'),
        },
      ],
    },
    {
      text: 'Контакты',
      href: getPermalink('/contact'),
    },
  ],

  actions: [
    {
      text: 'Запросить предложение',
      href: getPermalink('/contact'),
    },
  ],
};

export const footerData = {
  links: [
    {
      title: 'Продукция',
      links: [
        {
          text: 'Электрические чайники',
          href: getPermalink('/electric-kettle-manufacturer'),
        },
        {
          text: 'Чайники для кофе',
          href: getPermalink('/electric-kettle-manufacturer'),
        },
        {
          text: 'Рисоварки',
          href: getPermalink('/electric-rice-cooker-manufacturer'),
        },
        {
          text: 'Скороварки',
          href: getPermalink('/electric-pressure-cooker-manufacturer'),
        },
        {
          text: 'Электрические ланч-боксы',
          href: getPermalink('/electric-lunch-box-manufacturer'),
        },
      ],
    },

    {
      title: 'OEM / ODM',
      links: [
        {
          text: 'OEM/ODM производство',
          href: getPermalink('/oem'),
        },
        {
          text: 'Прайс и условия',
          href: getPermalink('/private-label'),
        },
        {
          text: 'OEM/ODM услуги',
          href: getPermalink('/services'),
        },
        {
          text: 'Контроль качества',
          href: getPermalink('/quality-control'),
        },
      ],
    },

    {
      title: 'Полезная информация',
      links: [
        {
          text: 'Блог',
          href: getBlogPermalink(),
        },
        {
          text: 'О компании',
          href: getPermalink('/about'),
        },
        {
          text: 'Наша фабрика',
          href: getPermalink('/fabrika'),
        },
        {
          text: 'Связаться с нами',
          href: getPermalink('/contact'),
        },
      ],
    },

    {
      title: 'Контакты',
      links: [
        {
          text: 'Website',
          href: 'https://www.yolec-electronics.com',
        },
        {
          text: 'Email',
          href: 'mailto:adrian@yolec-electronics.com',
        },
        {
          text: 'WhatsApp',
          href: 'https://wa.me/8613922332584',
        },
        {
          text: 'VK',
          href: 'https://vk.ru/kitchen_appliance_factory',
        },
        {
          text: 'YouTube',
          href: 'https://www.youtube.com/@yolec-electric-adrian',
        },
      ],
    },
  ],

  secondaryLinks: [
    {
      text: 'Политика конфиденциальности',
      href: getPermalink('/privacy'),
    },
    {
      text: 'Условия использования',
      href: getPermalink('/terms'),
    },
  ],

  socialLinks: [
    {
      ariaLabel: 'YouTube',
      icon: 'tabler:brand-youtube',
      href: 'https://www.youtube.com/@yolec-electric-adrian',
    },
    {
      ariaLabel: 'LinkedIn',
      icon: 'tabler:brand-linkedin',
      href: 'https://www.linkedin.com/in/adrian2010/',
    },
    {
      ariaLabel: 'WhatsApp',
      icon: 'tabler:brand-whatsapp',
      href: 'https://wa.me/8613922332584',
    },
    {
      ariaLabel: 'RSS',
      icon: 'tabler:rss',
      href: getAsset('/rss.xml'),
    },
  ],

  footNote: `
    © 2026 <strong>YOLEC Electric</strong> · Китайский производитель мелкой кухонной техники · OEM & ODM.
  `,
};
