import { ModelMetadata } from '~/types/model';

export function tooltipFormatter(models: ModelMetadata[]) {
  return (slug: string, value: number) => {
    return `
          <div>
            <strong><p>${
              models.find((model) => model.slug === slug)?.displayName
            }</p></strong>
            <code>${slug}</code>
            <br/>
            <em>${new Intl.NumberFormat().format(value)}</em>
          </div>
        `;
  };
}
