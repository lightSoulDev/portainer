package images

import (
	"net/http"

	"github.com/docker/docker/api/types"
	"github.com/portainer/portainer/api/http/handler/docker/utils"
	"github.com/portainer/portainer/api/internal/set"
	httperror "github.com/portainer/portainer/pkg/libhttp/error"
	"github.com/portainer/portainer/pkg/libhttp/request"
	"github.com/portainer/portainer/pkg/libhttp/response"
)

type ImageResponse struct {
	Created  int64    `json:"created"`
	NodeName string   `json:"nodeName"`
	ID       string   `json:"id"`
	Size     int64    `json:"size"`
	Tags     []string `json:"tags"`

	// Used is true if the image is used by at least one container
	// supplied only when withUsage is true
	Used bool `json:"used"`
}

// @id dockerImagesList
// @summary Fetch images
// @description
// @description **Access policy**:
// @tags docker
// @security jwt
// @param environmentId path int true "Environment identifier"
// @param withUsage query boolean false "Include image usage information"
// @produce json
// @success 200 {array} ImageResponse "Success"
// @failure 400 "Bad request"
// @failure 500 "Internal server error"
// @router /docker/{environmentId}/images [get]
func (handler *Handler) imagesList(w http.ResponseWriter, r *http.Request) *httperror.HandlerError {
	cli, httpErr := utils.GetClient(r, handler.dockerClientFactory)
	if httpErr != nil {
		return httpErr
	}

	images, err := cli.ImageList(r.Context(), types.ImageListOptions{})
	if err != nil {
		return httperror.InternalServerError("Unable to retrieve Docker images", err)
	}

	withUsage, err := request.RetrieveBooleanQueryParameter(r, "withUsage", true)
	if err != nil {
		return httperror.BadRequest("Invalid query parameter: withUsage", err)
	}

	imageUsageSet := set.Set[string]{}
	if withUsage {
		containers, err := cli.ContainerList(r.Context(), types.ContainerListOptions{})
		if err != nil {
			return httperror.InternalServerError("Unable to retrieve Docker containers", err)
		}

		for _, container := range containers {
			imageUsageSet.Add(container.ImageID)
		}
	}

	imagesList := make([]ImageResponse, len(images))
	for i, image := range images {
		imagesList[i] = ImageResponse{
			Created: image.Created,
			ID:      image.ID,
			Size:    image.Size,
			Tags:    image.RepoTags,
			Used:    imageUsageSet.Contains(image.ID),
		}
	}

	return response.JSON(w, imagesList)
}
